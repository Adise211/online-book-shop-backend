import { NextFunction, Request, Response } from "express";
import { Book, BookCategories, Result } from "../types.js";
import { bookCategories } from "../utils/consts.js";
import { isCategorieExist } from "../utils/utilFunc.js";
import { googleBooksAPIRequest } from "../services/index.js";
import {
  addBookToFavorites,
  getAllFavorites,
  removeBookFromFavorites,
} from "../models/books.model.js";
import { AppError, Codes } from "../utils/utilErrors.js";
import { Favorites } from "@prisma/client";

// get best seller books (for home page) - ✅
// get book categories - ✅
// get user favorites - ✅
// get a book by a categorie - ✅
// add a book to favorites - ✅
// remove a book from favorites - ✅

export async function getHomePageBooks(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const response = await googleBooksAPIRequest("bestseller&orderBy=newest");
    const result: Result<object> = {
      success: true,
      data: response,
    };
    res.status(Codes.Success.Ok).json(result);
  } catch (error) {
    // handle in appErrorHandler midddleware
    next(error);
  }
}

export async function getBookCategoriesList(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result: Result<object> = {
      success: true,
      data: bookCategories,
    };
    res.status(Codes.Success.Ok).json(result);
  } catch (error) {
    // handle in appErrorHandler midddleware
    next(error);
  }
}

export async function getBooksByCategorie(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { categorie } = req.params;
    if (categorie && isCategorieExist(categorie)) {
      const response = await googleBooksAPIRequest(`subject:${categorie}`);
      const result: Result<object> = {
        success: true,
        data: response,
      };
      res.status(Codes.Success.Ok).json(result);
    } else {
      throw new AppError(
        `Categorie '${categorie}' is not exist`,
        Codes.Client.Bad_Request
      );
    }
  } catch (error) {
    next(error);
  }
}

export async function addToFavorites(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const book: Book = req.body.data.book;
    const userId: number = req.body.data.userId;

    const saved = await addBookToFavorites(book, userId);
    const result: Result<Favorites> = {
      success: true,
      data: saved,
    };
    res.status(Codes.Success.Created).json(result);
  } catch (error) {
    // handle in appErrorHandler midddleware
    next(error);
  }
}

export async function removeFromFavorites(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId, bookId, googleVolumeId } = req.body.data;
    await removeBookFromFavorites(userId, bookId, googleVolumeId);
    const result: Result<object> = {
      success: true,
      data: {},
    };
    res.status(Codes.Success.Ok).json(result);
  } catch (error) {
    // handle in appErrorHandler midddleware
    next(error);
  }
}

export async function getUserFavorites(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const favorites = await getAllFavorites(req.body.userId);
    const result: Result<Favorites[]> = {
      success: true,
      data: favorites,
    };
    res.status(Codes.Success.Ok).json(result);
  } catch (error) {
    // handle in appErrorHandler midddleware
    next(error);
  }
}
