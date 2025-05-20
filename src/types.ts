import { Favorites, Users } from "@prisma/client";
import { bookCategories } from "./utils/consts.utils.js";

// external (google books, external api's)
// system (db)
export type ResultSource = "system" | "external" | "prisma";
type ResultCodes = 1 | -1;
export type RequestFieldSource = "body" | "query" | "params";
export type Result<T> =
  | { success: true; data: T }
  | { success: false; message: string; source: ResultSource | string };

export type BookCategories = (typeof bookCategories)[number]; //* turned array to type */

export interface UserInitInfo {
  email: Users["email"];
  password: Users["password"];
  name: Users["name"];
}

export interface BookInit {
  title: Favorites["title"];
  googleVolumeId: Favorites["googleVolumeId"];
  authors: Favorites["authors"];
  publishedDate: Favorites["publishedDate"]; //epoch miliseconds
  pageCount: Favorites["pageCount"];
  imageLink: Favorites["imageLink"];
  rating: Favorites["rating"];
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
