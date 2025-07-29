import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { AppDataSource } from "./config/data-source";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import transactionRoutes from "./routes/transactionRoutes";

// Load environment variables
dotenv.config();
console.log("PORT from .env:", process.env.PORT);

// Create Express app
const app = express();

// Middleware
app.use(express.json());

// Enable CORS for frontend
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);

// Start server after DB connection
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });
