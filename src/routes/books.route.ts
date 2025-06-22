import { Router } from "express";
import {
  getHomePageBooks,
  getBookCategoriesList,
  getBooksByCategorie,
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
} from "../controllers/books.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { validateFields } from "../middlewares/errorHandlers.middleware.js";

const bookRouter = Router();

/* BOOKS */
// --get
bookRouter.get("/books", getHomePageBooks);
bookRouter.get("/categories", getBookCategoriesList);
bookRouter.get("/books/:categorie", getBooksByCategorie);
// --post
bookRouter.post(
  "/favorites",
  authenticateToken,
  validateFields("body", ["userId"]),
  getUserFavorites
);
bookRouter.post(
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
bookRouter.delete(
  "/favorites",
  authenticateToken,
  validateFields("body", ["userId", "bookId", "googleVolumeId"]),
  removeFromFavorites
);

export default bookRouter;
