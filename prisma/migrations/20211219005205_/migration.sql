/*
  Warnings:

  - Made the column `articleId` on table `ThreadMessage` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `ThreadMessage` DROP FOREIGN KEY `ThreadMessage_ibfk_3`;

-- AlterTable
ALTER TABLE `ThreadMessage` MODIFY `articleId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `ThreadMessage` ADD FOREIGN KEY (`articleId`) REFERENCES `Article`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
