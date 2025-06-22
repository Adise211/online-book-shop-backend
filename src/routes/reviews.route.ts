import { Router } from "express";
import {
  createBookReview,
  deleteBookReview,
  updateBookReview,
} from "../controllers/reviews.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { validateFields } from "../middlewares/errorHandlers.middleware.js";

const reviewRouter = Router();

/* REVIEWS */
//--post
reviewRouter.post(
  "/reviews",
  authenticateToken,
  validateFields("body", ["rating", "description", "googleVolumeId", "userId"]),
  createBookReview
);
//--put
reviewRouter.put(
  "/reviews",
  authenticateToken,
  validateFields("body", ["id", "rating", "description", "googleVolumeId"]),
  updateBookReview
);
//--delete
reviewRouter.delete(
  "/reviews",
  authenticateToken,
  validateFields("body", ["id", "googleVolumeId"]),
  deleteBookReview
);

export default reviewRouter;
