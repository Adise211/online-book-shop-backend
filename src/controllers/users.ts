import { Request, Response } from "express";
import { createUser } from "../models/users.models.js";
import { ResponseToClient } from "../../types.js";
import { hashPassword } from "../services/index.js";

// auth: create user
// auth: get user
// auth: reset password
// auth: update profile (user-name, profile photo etc)
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
