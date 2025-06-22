import { Router } from "express";
import {
  signupUser,
  loginUser,
  logout,
  refreshToken,
} from "../controllers/users.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { validateFields } from "../middlewares/errorHandlers.middleware.js";

const userRouter = Router();

/* USERS */
userRouter.post(
  "/signup",
  validateFields("body", ["email", "password", "name"]),
  signupUser
);
userRouter.post(
  "/login",
  validateFields("body", ["email", "password"]),
  loginUser
);
userRouter.post("/logout", authenticateToken, logout);
userRouter.post("/refresh", refreshToken);

export default userRouter;
