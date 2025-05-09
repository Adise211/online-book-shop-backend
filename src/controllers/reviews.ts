import { Request, Response } from "express";
import { ResponseToClient, Review } from "../../types.js";
import { createReview } from "../models/reviews.models.js";
// get reviews
// create review
// update review
// delete review

export async function createBookReview(req: Request, res: Response) {
  try {
    let result: ResponseToClient;

    const { data, userId } = req.body;
    const newReview = await createReview(data, userId);
    result = {
      Result: {
        ResultCode: 1,
        ResultMessage: "",
        IsError: false,
        Source: "system",
      },
      Data: newReview,
    };
    res.status(201).json(result);
  } catch (error) {
    console.error("Error in createBookReview:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
