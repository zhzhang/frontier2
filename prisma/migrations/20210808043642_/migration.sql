/*
  Warnings:

  - You are about to drop the column `canAccess` on the `Review` table. All the data in the column will be lost.
  - You are about to alter the column `submissionDeadline` on the `Venue` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `venueDate` on the `Venue` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `Review` DROP COLUMN `canAccess`,
    ADD COLUMN `anonymized` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `Venue` MODIFY `submissionDeadline` DATETIME,
    MODIFY `venueDate` DATETIME;
