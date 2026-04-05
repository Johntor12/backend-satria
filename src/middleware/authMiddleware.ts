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
    const authorization = req.headers.authorization?.trim();

    if (!authorization) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const [scheme, ...rest] = authorization.split(/\s+/);

    if (!scheme || scheme.toLowerCase() !== "bearer" || rest.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Malformed Authorization header. Use: Bearer <token>",
      });
    }

    const rawToken = rest.join(" ").trim();
    const token = rawToken.replace(/^Bearer\s+/i, "").trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Malformed Authorization header. Use: Bearer <token>",
      });
    }

    const decoded = verifyToken(token);

    if (!decoded.valid) {
      return res.status(401).json({
        success: false,
        message: decoded.reason === "expired" ? "Token expired" : "Invalid token",
      });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Authentication error" });
  }
};
