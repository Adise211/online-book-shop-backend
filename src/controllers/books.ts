import { Request, Response } from "express";
import { ResponseToClient } from "../../types.js";
// get all books
// get a book by id
// update/add to favorites
// remove from favorites

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";
// performence tips: limited amount of results, return spesific fields
// more info: https://developers.google.com/books/docs/v1/performance
const GOOGLE_BOOKS_FILTERED_FIELDS =
  "kind, totalItems, items(id, volumeInfo(title, subtitle, authors, description, publishedDate, pageCount, categories, imageLinks, language ), saleInfo)";

export async function getHomePageBooks(req: Request, res: Response) {
  const response = await fetch(
    `${GOOGLE_BOOKS_API}?q=bestseller&orderBy=newest&fields=${GOOGLE_BOOKS_FILTERED_FIELDS}`
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

  res.send(result);
}
