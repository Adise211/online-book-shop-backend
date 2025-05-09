import { Request, Response } from "express";
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
// get a book by a categorie - ✅
// add a book to favorites - ✅
// remove a book from favorites - ✅

export async function getHomePageBooks(req: Request, res: Response) {
  const result = await googleBooksAPIRequest("bestseller&orderBy=newest");
  res.send(result);
}

export async function getBookCategoriesList(req: Request, res: Response) {
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
}

export async function getBooksByCategorie(req: Request, res: Response) {
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
}

export async function addToFavorites(req: Request, res: Response) {
  try {
    let result: ResponseToClient;

    if (req.body) {
      const book: Book = req.body.book;
      const userId: number = req.body.userId;
      // TODO: check if field is missing and show error which one

      // const {
      //   title,
      //   authors,
      //   publishedDate,
      //   pageCount,
      //   imageLink,
      //   rating,
      //   categories,
      // } = book;

      // if (
      //   !title ||
      //   !authors ||
      //   !publishedDate ||
      //   !pageCount ||
      //   !imageLink ||
      //   !rating ||
      //   !categories ||
      //   !userId
      // ) {
      //   res.status(400).json({ message: "Missing fields" });
      // }

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
    }
  } catch (error) {
    console.error("Error in addBookToFavorites:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function removeFromFavorites(req: Request, res: Response) {
  try {
    let result: ResponseToClient;

    if (req.body) {
      const { userId, bookId, googleVolumeId } = req.body;
      // TODO: check if field is missing and show error which one
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
    }
  } catch (error) {
    console.error("Error in removeFromFavorites:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getUserFavorites(req: Request, res: Response) {
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
    console.error("Error in getUserFavorites:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
