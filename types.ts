import { bookCategories } from "./src/utils/consts.js";

// external (google books, external api's)
// system (db)
type ResultSource = "system" | "external" | "prisma";
type ResultCodes = 1 | -1;
export type RequestFieldSource = "body" | "query" | "params";
export type Result<T> =
  | { success: true; data: T }
  | { success: false; message: string; source: ResultSource | string };

export type BookCategories = (typeof bookCategories)[number]; //* turned array to type */

// export interface User {
//   id?: number;
//   email: string;
//   password: string;
//   name: string;
//   favorites?: Book[];
//   reviews?: Review[];
// }

export interface Book {
  id?: number;
  title: string;
  googleVolumeId: string;
  authors: string[];
  publishedDate: number; //epoch miliseconds
  pageCount: number;
  imageLink: string;
  rating: number;
  categories: BookCategories[];
}

// export interface Review {
//   id?: number;
//   googleVolumeId: string;
//   rating: number;
//   description: string;
//   createdBy: User;
//   date: string;
//   userId: number;
// }

export interface ResponseToClient {
  Result: {
    ResultCode: ResultCodes;
    ResultMessage: string;
    IsError: boolean;
    Source: ResultSource;
  };
  Data: object | object[];
}
