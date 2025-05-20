import { AppError, Codes } from "../utils/errors.utils.js";
import { ResultSource } from "../types.js";

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";
// performence tips: limited amount of results, return spesific fields
// more info: https://developers.google.com/books/docs/v1/performance
const GOOGLE_BOOKS_FILTERED_FIELDS =
  "kind, totalItems, items(id, volumeInfo(title, subtitle, authors, description, publishedDate, pageCount, categories, imageLinks, language ), saleInfo)";

export async function googleBooksAPIRequest(query: string) {
  try {
    const response = await fetch(
      `${GOOGLE_BOOKS_API}?q=${query}&fields=${GOOGLE_BOOKS_FILTERED_FIELDS}`
    );

    let result = await response.json();
    // On success - send back the result
    return result;
  } catch (error) {
    // Get error code
    const errorCode: number =
      error &&
      typeof error === "object" &&
      "code" in error &&
      typeof error.code === "number"
        ? error.code
        : Codes.Server.General;
    // Get error source
    const source: ResultSource = "external";

    // Custom error class
    throw new AppError("Error in googleBooks API", errorCode, source);
  }
}
