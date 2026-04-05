import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "../config/env";

const SALT_ROUNDS = 10;

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return hashedPassword;
  } catch (error) {
    throw new Error("Error hashing password");
  }
};

// Compare password with hash
export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  try {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  } catch (error) {
    throw new Error("Error comparing password");
  }
};

// Generate JWT token
export const generateToken = (userId: number): string => {
  try {
    const token = jwt.sign({ userId }, getJwtSecret(), { expiresIn: "7d" });
    return token;
  } catch (error) {
    throw new Error("Error generating token");
  }
};

// Verify JWT token
export const verifyToken = (
  token: string,
): { valid: true; userId: number } | { valid: false; reason: "expired" | "invalid" } => {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as { userId: number };
    return { valid: true, userId: decoded.userId };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return { valid: false, reason: "expired" };
    }

    return { valid: false, reason: "invalid" };
  }
};
