import { NextFunction, Request, Response } from "express";
import { Users } from "@prisma/client";
import { createUser, findUserByEmail } from "../models/users.models.js";
import { Result } from "../../types.js";
import {
  generateToken,
  hashPassword,
  isPasswordCorrect,
} from "../utils/auth.utils.js";
import { Codes, AppError } from "../utils/utilErrors.js";

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
    let { email, password, name } = req.body.data;

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
        // password is correct - send token
        const token = generateToken({ userId: user.id, email: user.email });
        const successResult: Result<object> = {
          success: true,
          data: { user, token },
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
