import { Router } from "express";
import { registerUser, loginUser, getCurrentUser } from "../controllers/authController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/me", authenticate, getCurrentUser);

export default router;
