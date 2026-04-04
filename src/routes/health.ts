import { Router, Request, Response } from "express";
import pool from "../config/database";

const router = Router();

// Health check endpoint
router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      success: true,
      message: "Server is healthy",
      timestamp: new Date().toISOString(),
      database: "connected",
      databaseTime: result.rows[0].now,
    });
  } catch (error) {
    console.error("Health check error:", error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
