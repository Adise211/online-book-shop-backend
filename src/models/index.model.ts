import { Users, Reviews, Favorites } from "@prisma/client";

type User = Users;
type Review = Reviews;
type Favorite = Favorites;

type BookInit = {
  title: string;
  googleVolumeId: string;
  authors: string[];
  publishedDate: string;
  pageCount: number;
  imageLink: string;
  rating: number;
  categories: string[];
  userId: string;
};

export { User, Review, Favorite, BookInit };
