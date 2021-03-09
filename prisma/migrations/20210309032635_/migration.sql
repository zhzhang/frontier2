/*
  Warnings:

  - You are about to drop the `MetaReview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MetaReviewToReview` table. If the table is not empty, all the data it contains will be lost.
  - The migration will add a unique constraint covering the columns `[decisionId]` on the table `Submission`. If there are existing duplicate values, the migration will fail.
  - Added the required column `ownerId` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `decisionId` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `MetaReview` DROP FOREIGN KEY `MetaReview_ibfk_1`;

-- DropForeignKey
ALTER TABLE `MetaReview` DROP FOREIGN KEY `MetaReview_ibfk_3`;

-- DropForeignKey
ALTER TABLE `MetaReview` DROP FOREIGN KEY `MetaReview_ibfk_2`;

-- DropForeignKey
ALTER TABLE `_MetaReviewToReview` DROP FOREIGN KEY `_MetaReviewToReview_ibfk_1`;

-- DropForeignKey
ALTER TABLE `_MetaReviewToReview` DROP FOREIGN KEY `_MetaReviewToReview_ibfk_2`;

-- AlterTable
ALTER TABLE `Submission` ADD COLUMN     `ownerId` VARCHAR(191) NOT NULL,
    ADD COLUMN     `decisionId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `MetaReview`;

-- DropTable
DROP TABLE `_MetaReviewToReview`;

-- CreateTable
CREATE TABLE `Decision` (
    `id` VARCHAR(191) NOT NULL,
    `body` MEDIUMTEXT NOT NULL,
    `decision` BOOLEAN NOT NULL DEFAULT false,
    `articleId` VARCHAR(191) NOT NULL,
    `organizationId` VARCHAR(191),
    `authorId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DecisionToReview` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,
UNIQUE INDEX `_DecisionToReview_AB_unique`(`A`, `B`),
INDEX `_DecisionToReview_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Submission_decisionId_unique` ON `Submission`(`decisionId`);

-- AddForeignKey
ALTER TABLE `Decision` ADD FOREIGN KEY (`articleId`) REFERENCES `Article`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Decision` ADD FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Decision` ADD FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DecisionToReview` ADD FOREIGN KEY (`A`) REFERENCES `Decision`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DecisionToReview` ADD FOREIGN KEY (`B`) REFERENCES `Review`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Submission` ADD FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Submission` ADD FOREIGN KEY (`decisionId`) REFERENCES `Decision`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
