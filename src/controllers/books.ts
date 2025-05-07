import { Request, Response } from "express";
import { ResponseToClient, Book } from "../../types.js";
import { bookCategories } from "../utils/consts.js";
import { PARAMETER_IS_REQUIRED } from "../utils/errorMessages.js";
import { isCategorieExist } from "../utils/utilFunc.js";
import { googleBooksAPIRequest } from "../service/index.js";

// get best seller books (for home page) - ✅
// get book categories - ✅
// get a book by a categorie - ✅
// TODO: add a book to favorites
// TODO: remove a book from favorites

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

export async function addBookToFavorites(book: Book) {
  // Add to favorites table
}
