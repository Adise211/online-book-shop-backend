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

export async function updateReview(data: Review) {
  const { id, rating, description, googleVolumeId } = data;
  const updatedReview = await prisma.reviews.update({
    where: {
      id,
      googleVolumeId,
    },
    data: {
      googleVolumeId,
      rating,
      description,
    },
  });

  return updatedReview;
}

export async function deleteReview(data: Review) {
  const { id, googleVolumeId } = data;
  const deletedReview = await prisma.reviews.delete({
    where: {
      id,
      googleVolumeId,
    },
  });

  return deletedReview;
}
