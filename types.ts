import { bookCategories } from "./src/utils/consts.js";

// external (google books, external api's)
// system (db)
type ResultSource = "system" | "external";
type ResultCodes = 1 | -1;
type BookCategories = (typeof bookCategories)[number]; //* turned array to type */

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  favorites: Book[];
}

export interface Book {
  id: string;
  title: string;
  author: Auhtor;
  publishedYear: number;
  coverImgURL: string;
  rating: number;
  reviews: Review[];
  categorie: BookCategories;
}

export interface Auhtor {
  id: string;
  name: string;
  imgURL: string;
  books: Book[];
}

export interface Review {
  id: string;
  rate: number;
  text: string;
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
