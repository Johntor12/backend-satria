import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/authUtils";

export interface AuthRequest extends Request {
  userId?: number;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Authentication error" });
  }
};
