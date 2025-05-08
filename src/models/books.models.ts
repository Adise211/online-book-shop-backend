import { PrismaClient } from "@prisma/client";
import { Book } from "../../types.js";

// TODO: get all favorites by user id
// add to favorites - ✅
// TODO: remove from favorites

const prisma = new PrismaClient();

export async function addBookToFavorites(book: Book, userId: number) {
  const {
    title,
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
