/*
  Warnings:

  - You are about to drop the `ArticleAuthor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ArticleAuthor` DROP FOREIGN KEY `ArticleAuthor_ibfk_2`;

-- DropForeignKey
ALTER TABLE `ArticleAuthor` DROP FOREIGN KEY `ArticleAuthor_ibfk_1`;

-- AlterTable
ALTER TABLE `Venue` ADD COLUMN `submissionOpen` DATETIME(3);

-- DropTable
DROP TABLE `ArticleAuthor`;

-- CreateTable
CREATE TABLE `Authorship` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `authorNumber` INTEGER NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `articleId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Authorship` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Authorship` ADD FOREIGN KEY (`articleId`) REFERENCES `Article`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
