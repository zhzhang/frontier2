/*
  Warnings:

  - You are about to alter the column `submissionDeadline` on the `Venue` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `venueDate` on the `Venue` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `bio` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `Venue` MODIFY `submissionDeadline` DATETIME,
    MODIFY `venueDate` DATETIME;
