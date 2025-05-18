import { PrismaClient, Reviews } from "@prisma/client";

// TODO: get reviews by book id
// TODO: create a review
// TODO: update a review

const prisma = new PrismaClient();

export async function createReview(reviewData: Reviews, userId: number) {
  const { rating, description, googleVolumeId }: Reviews = reviewData;
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

export async function updateReview(reviewData: Reviews) {
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
}

export async function deleteReview(reviewData: Reviews) {
  const { id, googleVolumeId } = reviewData;
  const deletedReview = await prisma.reviews.delete({
    where: {
      id,
      googleVolumeId,
    },
  });

  return deletedReview;
}
