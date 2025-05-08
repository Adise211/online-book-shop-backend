import express from "express";
import { signupUser, loginUser } from "../controllers/users.js";
import {
  getHomePageBooks,
  getBookCategoriesList,
  getBooksByCategorie,
  addToFavorites,
} from "../controllers/books.js";
import { authenticateToken } from "../middlewares/auth.js";

const router = express.Router();

/* users */
router.post("/signup", signupUser);
router.post("/login", loginUser);

/* books */
router.get("/books", getHomePageBooks);
router.get("/categories", getBookCategoriesList);
router.get("/books/:categorie", getBooksByCategorie);
// test auth
router.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "Success!", user: (req as any).user });
});
router.post("/favorites", authenticateToken, addToFavorites);

export default router;
