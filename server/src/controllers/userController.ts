// src/controllers/userController.ts
import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { parse } from "json2csv";

const userRepo = AppDataSource.getRepository(User);

// GET /api/users
export const getAllUsers = async (req: Request, res: Response) => {
  const { balanceBelow, search } = req.query;

  let query = userRepo.createQueryBuilder("user");

  if (balanceBelow) {
    query = query.where("user.balance < :balance", {
      balance: Number(balanceBelow),
    });
  }

  if (search) {
    query = query.andWhere(
      "user.name ILIKE :search OR user.email ILIKE :search",
      {
        search: `%${search}%`,
      }
    );
  }

  const users = await query.getMany();
  res.json(users);
};

// GET /api/users/:id
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await userRepo.findOne({
    where: { id },
    relations: ["transactions"],
  });

  if (!user) return res.status(404).json({ error: "User not found" });

  res.json(user);
};

// GET /api/users/export
export const exportUsersToCSV = async (_req: Request, res: Response) => {
  const users = await userRepo.find();
  const fields = ["id", "name", "email", "accountType", "balance", "role"];
  const csv = parse(users, { fields });

  res.header("Content-Type", "text/csv");
  res.attachment("users.csv");
  res.send(csv);
};
