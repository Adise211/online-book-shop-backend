import { Request, Response } from "express";
import { ResponseToClient } from "../../types.js";
import { bookCategories } from "../utils/consts.js";
import { PARAMETER_IS_REQUIRED } from "../utils/errorMessages.js";
import { isCategorieExist } from "../utils/utilFunc.js";

// get best seller books (for home page) - ✅
// get book categories - ✅
// get a book by a categorie - ✅
// TODO: add a book to favorites
// TODO: remove a book from favorites

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";
// performence tips: limited amount of results, return spesific fields
// more info: https://developers.google.com/books/docs/v1/performance
const GOOGLE_BOOKS_FILTERED_FIELDS =
  "kind, totalItems, items(id, volumeInfo(title, subtitle, authors, description, publishedDate, pageCount, categories, imageLinks, language ), saleInfo)";

async function googleBooksAPIRequest(query: string): Promise<ResponseToClient> {
  const response = await fetch(
    `${GOOGLE_BOOKS_API}?q=${query}&fields=${GOOGLE_BOOKS_FILTERED_FIELDS}`
  );

  let books = await response.json();
  let result: ResponseToClient;

  if (response.ok) {
    result = {
      Result: {
        ResultCode: 1,
        ResultMessage: "",
        IsError: false,
        Source: "external",
      },
      Data: books,
    };
  } else {
    result = {
      Result: {
        ResultCode: -1,
        ResultMessage: books.error?.message,
        IsError: true,
        Source: "external",
      },
      Data: [],
    };
  }
  return result;
}

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
