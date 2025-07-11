import { PrismaClient, Users } from "@prisma/client";
import { BookInit } from "../types.js";

// get all favorites by user id - ✅
// add to favorites - ✅
// remove from favorites - ✅

const prisma = new PrismaClient();

export async function addBookToFavorites(book: BookInit, userId: number) {
  const {
    title,
    googleVolumeId,
    authors,
    publishedDate,
    pageCount,
    imageLink,
    rating,
    categories,
  } = book;

  const favoriteBook = await prisma.favorites.create({
    data: {
      title,
      googleVolumeId,
      authors,
      publishedDate,
      pageCount,
      imageLink,
      rating,
      categories,
      userId,
    },
  });

  return favoriteBook;
}

export async function removeBookFromFavorites(
  userId: number,
  bookId: number,
  googleVolumeId: string
) {
  const deletedBook = await prisma.favorites.delete({
    where: {
      id: bookId,
      userId,
      googleVolumeId,
    },
  });

  return deletedBook;
}

export async function getAllFavorites(userId: Users["id"]) {
  const favorites = prisma.favorites.findMany({
    where: {
      userId,
    },
  });

  return favorites;
}
