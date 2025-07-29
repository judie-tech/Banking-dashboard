// src/controllers/transactionController.ts
import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { Transaction } from "../entities/Transaction";
import { parse } from "json2csv";

const userRepo = AppDataSource.getRepository(User);
const transactionRepo = AppDataSource.getRepository(Transaction);

// POST /api/transactions/transfer
export const transferMoney = async (req: Request, res: Response) => {
  const { senderId, receiverId, amount, note } = req.body;

  const sender = await userRepo.findOneBy({ id: senderId });
  const receiver = await userRepo.findOneBy({ id: receiverId });

  if (!sender || !receiver)
    return res.status(404).json({ error: "User not found" });

  if (sender.balance < amount)
    return res.status(400).json({ error: "Insufficient funds" });

  sender.balance -= amount;
  receiver.balance += amount;
  await userRepo.save([sender, receiver]);

  const debitTx = transactionRepo.create({
    type: "debit",
    amount,
    note,
    user: sender,
  });
  const creditTx = transactionRepo.create({
    type: "credit",
    amount,
    note,
    user: receiver,
  });

  await transactionRepo.save([debitTx, creditTx]);

  res.status(200).json({ message: "Transfer successful" });
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
