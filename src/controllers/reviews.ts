import { NextFunction, Request, Response } from "express";
import { Result } from "../../types.js";
import {
  createReview,
  deleteReview,
  updateReview,
} from "../models/reviews.models.js";
import { Codes } from "../utils/utilErrors.js";
import { Reviews } from "@prisma/client";
// get reviews
// create review
// update review
// delete review

export async function createBookReview(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { reviewData, userId } = req.body.data;
    const newReview = await createReview(reviewData, userId);
    const result: Result<Reviews> = {
      success: true,
      data: newReview,
    };
    res.status(Codes.Success.Created).json(result);
  } catch (error) {
    next(error);
  }
}

export async function updateBookReview(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const updatedReview = await updateReview(req.body.data);

    if (updatedReview) {
      const result: Result<Reviews> = {
        success: true,
        data: updatedReview,
      };

      res.status(Codes.Success.Created).json(result);
    }
  } catch (error) {
    next(error);
  }
}

export async function deleteBookReview(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await deleteReview(req.body.data);
    const result: Result<object> = {
      success: true,
      data: {},
    };
    res.status(Codes.Success.Ok).json(result);
  } catch (error) {
    next(error);
  }
}
