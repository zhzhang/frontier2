/*
  Warnings:

  - You are about to drop the column `comment` on the `Relation` table. All the data in the column will be lost.
  - You are about to alter the column `submissionDeadline` on the `Venue` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `venueDate` on the `Venue` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - Added the required column `endYear` to the `Relation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Relation` DROP COLUMN `comment`,
    ADD COLUMN `email` VARCHAR(191),
    ADD COLUMN `endYear` VARCHAR(191) NOT NULL,
    ADD COLUMN `name` VARCHAR(191);

-- AlterTable
ALTER TABLE `Venue` MODIFY `submissionDeadline` DATETIME,
    MODIFY `venueDate` DATETIME;
