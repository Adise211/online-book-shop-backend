import express from "express";
import { signupUser, loginUser } from "../controllers/users.js";
import {
  getHomePageBooks,
  getBookCategoriesList,
  getBooksByCategorie,
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
} from "../controllers/books.js";
import { authenticateToken } from "../middlewares/auth.js";
import { validateFields } from "../middlewares/errorHandler.js";
import {
  createBookReview,
  deleteBookReview,
  updateBookReview,
} from "../controllers/reviews.js";

const router = express.Router();

/* USERS */
// --post
router.post(
  "/signup",
  validateFields("body", ["email", "password", "name"]),
  signupUser
);
router.post("/login", validateFields("body", ["email", "password"]), loginUser);

/* BOOKS */
// --get
router.get("/books", getHomePageBooks);
router.get("/categories", getBookCategoriesList);
router.get("/books/:categorie", getBooksByCategorie);
// --post
router.post(
  "/favorites",
  authenticateToken,
  validateFields("body", ["userId"]),
  getUserFavorites
);
router.post(
  "/favorites/add",
  authenticateToken,
  validateFields("body", [
    "title",
    "googleVolumeId",
    "authors",
    "publishedDate",
    "pageCount",
    "imageLink",
    "rating",
    "categories",
    "userId",
  ]),
  addToFavorites
);
// --delete
router.delete(
  "/favorites",
  authenticateToken,
  validateFields("body", ["userId", "bookId", "googleVolumeId"]),
  removeFromFavorites
);

/* REVIEWS */
//--post
router.post(
  "/reviews",
  authenticateToken,
  validateFields("body", ["rating", "description", "googleVolumeId"]),
  createBookReview
);
//--put
router.put(
  "/reviews",
  authenticateToken,
  validateFields("body", ["id", "rating", "description", "googleVolumeId"]),
  updateBookReview
);
//delete
router.delete(
  "/reviews",
  authenticateToken,
  validateFields("body", ["id", "googleVolumeId"]),
  deleteBookReview
);

export default router;
