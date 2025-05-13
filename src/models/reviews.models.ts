import { PrismaClient, Prisma } from "@prisma/client";
import { Review, User } from "../../types.js";
import { prismaErrorHandler } from "../utils/utilFunc.js";

// TODO: get reviews by book id
// TODO: create a review
// TODO: update a review

const prisma = new PrismaClient();

export async function createReview(reviewData: Review, userId: User["id"]) {
  const { rating, description, googleVolumeId }: Review = reviewData;
  const createdReview = await prisma.reviews.create({
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

  return createdReview;
}

export async function updateReview(reviewData: Review) {
  try {
    const { id, rating, description, googleVolumeId } = reviewData;
    const updatedReview = await prisma.reviews.update({
      where: {
        id,
        googleVolumeId,
      },
      data: {
        rating,
        description,
      },
    });

    return updatedReview;
  } catch (error) {
    // this function handles prisma errors in one place
    throw prismaErrorHandler(error);
  }
}

export async function deleteReview(reviewData: Review) {
  const { id, googleVolumeId } = reviewData;
  const deletedReview = await prisma.reviews.delete({
    where: {
      id,
      googleVolumeId,
    },
  });

  return deletedReview;
}
