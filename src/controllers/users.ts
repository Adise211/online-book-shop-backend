import { Request, Response } from "express";
import { createUser, findUserByEmail } from "../models/users.models.js";
import { ResponseToClient } from "../../types.js";
import {
  generateToken,
  hashPassword,
  isPasswordCorrect,
} from "../utils/auth.utils.js";

// auth: create user - ✅
// auth: get user - ✅
// TODO: auth: reset password
// TODO: auth: update profile (user-name, profile photo etc)
// TODO: add sanitizer (DOMPurify)

export async function signupUser(req: Request, res: Response) {
  try {
    /* Notice: body treated with type 'any' */
    let result: ResponseToClient;

    if (req.body) {
      let { email, password, name } = req.body;

      if (!email || !password || !name) {
        res.status(400).json({ message: "Missing fields" });
      }

      const hashedPassword = await hashPassword(password);
      if (hashedPassword) {
        password = hashedPassword;
        const data = { email, password, name, favorites: [], reviews: [] };
        const response = await createUser(data);
        result = {
          Result: {
            ResultCode: 1,
            ResultMessage: "",
            IsError: false,
            Source: "system",
          },
          Data: response,
        };
        res.status(201).json(result);
      }
    }
  } catch (error) {
    console.error("Error in signupUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    let result: ResponseToClient;

    if (req.body) {
      console.log("AA:", req.body);

      let { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: "Missing fields" });
      }

      const user = await findUserByEmail(email);
      console.log("BB:", user);

      if (!user) {
        res.status(400).json({ message: "User is not exist" });
      } else {
        const isCorrect = await isPasswordCorrect(password, user.password);
        console.log("CC:", isCorrect);

        if (isCorrect) {
          const token = generateToken({ userId: user.id, email: user.email });

          result = {
            Result: {
              ResultCode: 1,
              ResultMessage: "Success in login",
              IsError: false,
              Source: "system",
            },
            Data: { user, token },
          };
          res.status(201).json(result);
        } else {
          result = {
            Result: {
              ResultCode: -1,
              ResultMessage: "Incorrect email or password",
              IsError: true,
              Source: "system",
            },
            Data: {},
          };
          res.json(result);
        }
      }
    }
  } catch (error) {}
}
