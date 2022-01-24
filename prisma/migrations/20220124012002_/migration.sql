/*
  Warnings:

  - Added the required column `reviewRequestId` to the `ReviewRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ReviewRequest` ADD COLUMN `reviewRequestId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `ReviewRequest` ADD CONSTRAINT `ReviewRequest_reviewRequestId_fkey` FOREIGN KEY (`reviewRequestId`) REFERENCES `ReviewRequest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
