/*
  Warnings:

  - You are about to alter the column `submissionDeadline` on the `Venue` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `venueDate` on the `Venue` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `Venue` ADD COLUMN `logoRef` VARCHAR(191),
    MODIFY `submissionDeadline` DATETIME,
    MODIFY `venueDate` DATETIME;
