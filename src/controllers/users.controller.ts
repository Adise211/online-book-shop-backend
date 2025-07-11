import { NextFunction, Request, Response } from "express";
import { Users } from "@prisma/client";
import { createUser, findUserByEmail } from "../models/users.model.js";
import { Result, UserInitInfo } from "../types.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  isPasswordCorrect,
  verifyRefreshToken,
} from "../utils/auth.utils.js";
import { Codes, AppError } from "../utils/errors.utils.js";

// auth: create user - ✅
// auth: get user - ✅
// TODO: auth: reset password
// TODO: auth: update profile (user-name, profile photo etc)
// TODO: add sanitizer (DOMPurify)

export async function signupUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    /* Notice: body treated with type 'any' */
    let { email, password, name }: UserInitInfo = req.body.data;

    const hashedPassword = await hashPassword(password);
    if (hashedPassword) {
      password = hashedPassword;
      const response = await createUser({ email, password, name });
      const result: Result<Users> = {
        success: true,
        data: response,
      };
      res.status(Codes.Success.Created).json(result);
    }
  } catch (error) {
    // handle in appErrorHandler midddleware
    next(error);
  }
}

export async function loginUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let { email, password }: Users = req.body;

    const user = await findUserByEmail(email);
    // user is not exist
    if (!user) {
      throw new AppError("User is not exist", Codes.Client.Not_Found);
    } else {
      // user exist - check if password is correct
      const isCorrect = await isPasswordCorrect(password, user.password);
      if (isCorrect) {
        const payload = {
          userId: user.id,
          email: user.email,
        };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);
        const cookieName = process.env.COOKIE_NAME_FOR_TOKEN as string;
        // set refresh token in cookie
        res.cookie(cookieName, refreshToken, {
          httpOnly: true, // accessible only by the web server
          secure: process.env.NODE_ENV === "production", // HTTPS only in production
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
        });

        // password is correct - send token
        const successResult: Result<object> = {
          success: true,
          data: { user, accessToken },
        };
        res.status(Codes.Success.Created).json(successResult);
      } else {
        // password is incorrect
        throw new AppError(
          "Incorrect email or password",
          Codes.Client.Not_Found
        );
      }
    }
  } catch (error) {
    // handle in appErrorHandler midddleware
    next(error);
  }
}

export async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const cookieName = process.env.COOKIE_NAME_FOR_TOKEN as string;
    const token = req.cookies[cookieName];

    if (!token) {
      throw new AppError("No refresh token", Codes.Client.Unauthorized);
    }
    const decoded = verifyRefreshToken(token);
    const newAccessToken = generateAccessToken({
      userId: decoded.userId,
      email: decoded.email,
    });

    const successResult: Result<object> = {
      success: true,
      data: { accessToken: newAccessToken },
    };
    res.status(Codes.Success.Created).json(successResult);
  } catch (error) {
    // handle in appErrorHandler midddleware
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const cookieName = process.env.COOKIE_NAME_FOR_TOKEN as string;
    // clear refresh token from cookie
    res.clearCookie(cookieName, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    // send success result
    const successResult: Result<object> = {
      success: true,
      data: {},
    };
    res.status(Codes.Success.Created).json(successResult);
    // res.status(Codes.Success.Ok).json({ message: "Logged out successfully" });
  } catch (error) {
    // handle in appErrorHandler midddleware
    next(error);
  }
}
