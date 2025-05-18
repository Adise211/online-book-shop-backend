import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/utilAuth.js";
// authenticate user (email & password) - ✅
// authorization (token) - ✅

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1]; // Bearer <token>

    if (!token) {
      res.status(401).json({ message: "No token provided" });
    } else {
      const user = verifyAccessToken(token);
      (req as any).user = user; // attach user to request
      next();
    }
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
}
