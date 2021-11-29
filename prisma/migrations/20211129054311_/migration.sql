/*
  Warnings:

  - You are about to drop the column `bio` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[twitter]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[website]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[profilePictureUrl]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `bio`,
    ADD COLUMN `institution` VARCHAR(191),
    ADD COLUMN `twitter` VARCHAR(191),
    ADD COLUMN `website` VARCHAR(191);

-- CreateIndex
CREATE UNIQUE INDEX `User.twitter_unique` ON `User`(`twitter`);

-- CreateIndex
CREATE UNIQUE INDEX `User.website_unique` ON `User`(`website`);

-- CreateIndex
CREATE UNIQUE INDEX `User.profilePictureUrl_unique` ON `User`(`profilePictureUrl`);
