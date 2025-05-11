import { Request, Response } from "express";
import { ResponseToClient, Review } from "../../types.js";
import {
  createReview,
  deleteReview,
  updateReview,
} from "../models/reviews.models.js";
// get reviews
// create review
// update review
// delete review

export async function createBookReview(req: Request, res: Response) {
  try {
    let result: ResponseToClient;

    const { reviewData, userId } = req.body.data;
    const newReview = await createReview(reviewData, userId);
    result = {
      Result: {
        ResultCode: 1,
        ResultMessage: "Created successfuly!",
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

export async function updateBookReview(req: Request, res: Response) {
  try {
    let result: ResponseToClient;
    const updatedReview = await updateReview(req.body.data);
    result = {
      Result: {
        ResultCode: 1,
        ResultMessage: "Updated successfuly!",
        IsError: false,
        Source: "system",
      },
      Data: updatedReview,
    };
    res.status(201).json(result);
  } catch (error) {
    console.error("Error in updateBookReview:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteBookReview(req: Request, res: Response) {
  try {
    let result: ResponseToClient;
    await deleteReview(req.body.data);
    result = {
      Result: {
        ResultCode: 1,
        ResultMessage: "Removed successfuly!",
        IsError: false,
        Source: "system",
      },
      Data: [],
    };
    res.status(201).json(result);
  } catch (error) {
    console.error("Error in deleteBookReview:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
