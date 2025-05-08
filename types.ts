import { bookCategories } from "./src/utils/consts.js";

// external (google books, external api's)
// system (db)
type ResultSource = "system" | "external";
type ResultCodes = 1 | -1;
export type BookCategories = (typeof bookCategories)[number]; //* turned array to type */

export interface User {
  id?: string;
  email: string;
  password: string;
  name: string;
  favorites?: Book[];
  reviews?: Review[];
}

export interface Book {
  id: string;
  title: string;
  authors: Auhtor[];
  publishedDate: string;
  pageCount: number;
  imageLink: string;
  rating: number;
  categories: BookCategories[];
  reviews: Review[];
}

export interface Auhtor {
  id: string;
  name: string;
  imgURL: string;
  books: Book[];
}

export interface Review {
  id: string;
  rating: number;
  description: string;
  createdBy: User;
  date: string;
}

export interface ResponseToClient {
  Result: {
    ResultCode: ResultCodes;
    ResultMessage: string;
    IsError: boolean;
    Source: ResultSource;
  };
  Data: object | object[];
}
