import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/auth.utils.js";
import { AppError, Codes } from "../utils/errors.utils.js";
import { ResultSource } from "../types.js";
// authenticate user (email & password) - ✅
// authorization (token) - ✅

let resultSource: ResultSource = "system";

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // default error

    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1]; // Bearer <token>

    if (!token) {
      next(
        new AppError(
          "No token provided",
          Codes.Client.Unauthorized,
          resultSource
        )
      );
    } else {
      const user = verifyAccessToken(token);
      (req as any).user = user; // attach user to request
      next();
    }
  } catch (err) {
    next(
      new AppError(
        "Invalid or expired token",
        Codes.Client.Forbidden,
        resultSource
      )
    );
  }
}
