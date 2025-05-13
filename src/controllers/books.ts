import { NextFunction, Request, Response } from "express";
import { ResponseToClient, Book } from "../../types.js";
import { bookCategories } from "../utils/consts.js";
import { PARAMETER_IS_REQUIRED } from "../utils/errorMessages.js";
import { isCategorieExist } from "../utils/utilFunc.js";
import { googleBooksAPIRequest } from "../services/index.js";
import {
  addBookToFavorites,
  getAllFavorites,
  removeBookFromFavorites,
} from "../models/books.models.js";

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
    const result = await googleBooksAPIRequest("bestseller&orderBy=newest");
    res.send(result);
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
    let result: ResponseToClient;

    result = {
      Result: {
        ResultCode: 1,
        ResultMessage: "",
        IsError: false,
        Source: "system",
      },
      Data: bookCategories,
    };

    res.send(result);
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
    let result: ResponseToClient;

    const { categorie } = req.params;
    if (categorie && isCategorieExist(categorie)) {
      result = await googleBooksAPIRequest(`subject:${categorie}`);
    } else {
      const resultMsg = !isCategorieExist(categorie)
        ? `Categorie '${categorie}' is not exist`
        : `${PARAMETER_IS_REQUIRED}: categorie`;

      result = {
        Result: {
          ResultCode: -1,
          ResultMessage: resultMsg,
          IsError: true,
          Source: "system",
        },
        Data: [],
      };
    }
    res.send(result);
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
    let result: ResponseToClient;

    // let book: Book;
    const book: Book = req.body.data.book;
    const userId: number = req.body.data.userId;

    const saved = await addBookToFavorites(book, userId);
    result = {
      Result: {
        ResultCode: 1,
        ResultMessage: "",
        IsError: false,
        Source: "system",
      },
      Data: saved,
    };
    res.status(201).json(result);
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
    let result: ResponseToClient;

    const { userId, bookId, googleVolumeId } = req.body.data;
    await removeBookFromFavorites(userId, bookId, googleVolumeId);

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
    let result: ResponseToClient;

    if (req.body) {
      const favorites = await getAllFavorites(req.body.userId);
      result = {
        Result: {
          ResultCode: 1,
          ResultMessage: "",
          IsError: false,
          Source: "system",
        },
        Data: favorites,
      };
      res.status(201).json(result);
    }
  } catch (error) {
    // handle in appErrorHandler midddleware
    next(error);
  }
}
