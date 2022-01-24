/*
  Warnings:

  - You are about to drop the column `reviewRequestId` on the `ReviewRequest` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `ReviewRequest` DROP FOREIGN KEY `ReviewRequest_reviewRequestId_fkey`;

-- AlterTable
ALTER TABLE `ReviewRequest` DROP COLUMN `reviewRequestId`,
    ADD COLUMN `parentRequestId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `ReviewRequest` ADD CONSTRAINT `ReviewRequest_parentRequestId_fkey` FOREIGN KEY (`parentRequestId`) REFERENCES `ReviewRequest`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
