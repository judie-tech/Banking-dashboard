// src/routes/transactionRoutes.ts
import { Router } from "express";
import {
  transferMoney,
  depositMoney,
  getTransactions,
  exportTransactionsCSV,
  getUserTransactions, // ✅ Add this
} from "../controllers/transactionController";
import { auth } from "../middleware/auth";

const router = Router();

router.post("/transfer", auth, transferMoney);
router.post("/deposit", auth, depositMoney);
router.get("/", auth, getTransactions);
router.get("/export/csv", auth, exportTransactionsCSV);
router.get("/user/:userId", auth, getUserTransactions); // ✅ Add this route

export default router;
