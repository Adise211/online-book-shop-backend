import express from "express";
import {
  signupUser,
  loginUser,
  logout,
  refreshToken,
} from "../controllers/users.controller.js";
import {
  getHomePageBooks,
  getBookCategoriesList,
  getBooksByCategorie,
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
} from "../controllers/books.controller.js";
import { authenticateToken } from "../middlewares/auth.js";
import { validateFields } from "../middlewares/errorHandlers.js";
import {
  createBookReview,
  deleteBookReview,
  updateBookReview,
} from "../controllers/reviews.controller.js";

const router = express.Router();

/* USERS */
// --post
router.post(
  "/signup",
  validateFields("body", ["email", "password", "name"]),
  signupUser
);
router.post("/login", validateFields("body", ["email", "password"]), loginUser);
router.post("/logout", authenticateToken, logout);
router.post("/refresh", refreshToken);

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
  validateFields("body", ["rating", "description", "googleVolumeId", "userId"]),
  createBookReview
);
//--put
router.put(
  "/reviews",
  authenticateToken,
  validateFields("body", ["id", "rating", "description", "googleVolumeId"]),
  updateBookReview
);
//--delete
router.delete(
  "/reviews",
  authenticateToken,
  validateFields("body", ["id", "googleVolumeId"]),
  deleteBookReview
);

export default router;
