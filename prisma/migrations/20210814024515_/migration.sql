/*
  Warnings:

  - You are about to drop the column `email` on the `Relation` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Relation` table. All the data in the column will be lost.
  - You are about to alter the column `submissionDeadline` on the `Venue` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `venueDate` on the `Venue` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `Relation` DROP COLUMN `email`,
    DROP COLUMN `name`;

-- AlterTable
ALTER TABLE `Venue` MODIFY `submissionDeadline` DATETIME,
    MODIFY `venueDate` DATETIME;
