import { PrismaClient } from "@prisma/client";
import { Review, User } from "../../types.js";

// TODO: get reviews by book id
// TODO: create a review
// TODO: update a review

const prisma = new PrismaClient();

export async function createReview(data: Review, userId: number) {
  const { rating, description, googleVolumeId } = data;
  const review = await prisma.reviews.create({
    data: {
      googleVolumeId,
      rating,
      description,
      createdBy: {
        connect: {
          id: userId,
        },
      },
    },
  });

  return review;
}
