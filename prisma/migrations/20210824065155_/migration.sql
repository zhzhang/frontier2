/*
  Warnings:

  - You are about to drop the column `userId` on the `ThreadMessage` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `ThreadMessage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ThreadMessage` DROP FOREIGN KEY `ThreadMessage_ibfk_1`;

-- AlterTable
ALTER TABLE `ThreadMessage` DROP COLUMN `userId`,
    ADD COLUMN `authorId` VARCHAR(191) NOT NULL,
    ADD COLUMN `published` BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE `ThreadMessage` ADD FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
