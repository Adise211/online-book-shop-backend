/*
  Warnings:

  - You are about to drop the `_FavoritesToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Favorites` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_FavoritesToUser" DROP CONSTRAINT "_FavoritesToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_FavoritesToUser" DROP CONSTRAINT "_FavoritesToUser_B_fkey";

-- AlterTable
ALTER TABLE "Favorites" ADD COLUMN     "userId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_FavoritesToUser";

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
