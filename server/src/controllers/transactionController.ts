import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { Transaction } from "../entities/Transaction";
import { parse } from "json2csv";

const userRepo = AppDataSource.getRepository(User);
const transactionRepo = AppDataSource.getRepository(Transaction);

// POST /api/transactions/transfer
// POST /api/transactions/transfer
export const transferMoney = async (req: Request, res: Response) => {
  const { senderId, receiverId, receiverName, amount, note } = req.body;

  // Validate sender
  const sender = await userRepo.findOneBy({ id: senderId });
  if (!sender) return res.status(404).json({ error: "Sender not found" });

  console.log("Sender balance from DB:", sender.balance);
  console.log("Amount to transfer:", amount);

  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({ error: "Invalid transfer amount" });
  }

  console.log(
    "Sender balance:",
    sender.balance,
    "Requested amount:",
    numericAmount
  );

  if (sender.balance < numericAmount) {
    return res.status(400).json({ error: "Insufficient funds" });
  }

  sender.balance -= numericAmount;
  await userRepo.save(sender);

  const debitTx = transactionRepo.create({
    type: "debit",
    amount: numericAmount,
    note: note || `Transfer to ${receiverName || "external user"}`,
    user: sender,
  });

  let creditTx = null;

  if (receiverId) {
    try {
      const receiver = await userRepo.findOneBy({ id: receiverId });
      if (receiver) {
        receiver.balance += numericAmount;
        await userRepo.save(receiver);

        creditTx = transactionRepo.create({
          type: "credit",
          amount: numericAmount,
          note: note || `Received from ${sender.name}`,
          user: receiver,
        });
      }
    } catch (err) {
      console.warn("Receiver lookup failed:", err);
    }
  }

  await transactionRepo.save([debitTx, ...(creditTx ? [creditTx] : [])]);

  res.status(200).json({
    message: "Transfer successful",
    debitTransactionId: debitTx.id,
    credited: !!creditTx,
    externalReceiver: !creditTx && (receiverName || receiverId),
  });
};

// POST /api/transactions/deposit
export const depositMoney = async (req: Request, res: Response) => {
  const { userId, amount, note } = req.body;

  const user = await userRepo.findOneBy({ id: userId });
  if (!user) return res.status(404).json({ error: "User not found" });

  user.balance += amount;
  await userRepo.save(user);

  const depositTx = transactionRepo.create({
    type: "credit",
    amount,
    note: note || "Deposit",
    user,
  });

  await transactionRepo.save(depositTx);

  res.status(200).json({ message: "Deposit successful" });
};

// GET /api/transactions
export const getTransactions = async (req: Request, res: Response) => {
  const { type, from, to, min, max, page = 1 } = req.query as any;
  const take = 10;
  const skip = (page - 1) * take;

  let query = transactionRepo
    .createQueryBuilder("tx")
    .leftJoinAndSelect("tx.user", "user")
    .skip(skip)
    .take(take)
    .orderBy("tx.createdAt", "DESC");

  if (type) query = query.andWhere("tx.type = :type", { type });
  if (from && to)
    query = query.andWhere("tx.createdAt BETWEEN :from AND :to", { from, to });
  if (min) query = query.andWhere("tx.amount >= :min", { min });
  if (max) query = query.andWhere("tx.amount <= :max", { max });

  const [transactions, total] = await query.getManyAndCount();

  res.json({
    page: Number(page),
    totalPages: Math.ceil(total / take),
    transactions,
  });
};

// GET /api/transactions/export
export const exportTransactionsCSV = async (_req: Request, res: Response) => {
  const transactions = await transactionRepo.find({ relations: ["user"] });

  const data = transactions.map((tx) => ({
    id: tx.id,
    type: tx.type,
    amount: tx.amount,
    note: tx.note,
    user: tx.user.name,
    date: tx.createdAt,
  }));

  const fields = ["id", "type", "amount", "note", "user", "date"];
  const csv = parse(data, { fields });

  res.header("Content-Type", "text/csv");
  res.attachment("transactions.csv");
  res.send(csv);
};
// GET /api/transactions/user/:userId
// GET /api/transactions/user/:userId
export const getUserTransactions = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const {
    from,
    to,
    type,
    sortBy = "date",
    sortOrder = "desc",
    page = 1,
  } = req.query;

  const take = 10;
  const skip = (Number(page) - 1) * take;

  try {
    let query = transactionRepo
      .createQueryBuilder("tx")
      .leftJoinAndSelect("tx.user", "user")
      .where("user.id = :userId", { userId })
      .skip(skip)
      .take(take);

    // Filter by date range
    if (from && to) {
      query = query.andWhere("tx.createdAt BETWEEN :from AND :to", {
        from,
        to,
      });
    }

    // Filter by type
    if (type && type !== "all") {
      query = query.andWhere("tx.type = :type", { type });
    }

    // Sorting
    const sortColumn = sortBy === "amount" ? "tx.amount" : "tx.createdAt";
    query = query.orderBy(
      sortColumn,
      sortOrder.toUpperCase() as "ASC" | "DESC"
    );

    const [transactions, total] = await query.getManyAndCount();

    res.status(200).json({
      transactions,
      totalPages: Math.ceil(total / take),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};
