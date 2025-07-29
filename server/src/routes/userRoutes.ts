// src/routes/userRoutes.ts
import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  exportUsersToCSV,
} from "../controllers/userController";
import { auth, authorize } from "../middleware/auth";

const router = Router();

// Admin-only
router.get("/", auth, authorize("ADMIN"), getAllUsers);
router.get("/:id", auth, getUserById);
router.get("/export/csv", auth, authorize("ADMIN"), exportUsersToCSV);

export default router;
