/*
  Warnings:

  - You are about to drop the column `venueId` on the `Review` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Review` DROP FOREIGN KEY `Review_ibfk_3`;

-- AlterTable
ALTER TABLE `Review` DROP COLUMN `venueId`,
    MODIFY `publishTimestamp` DATETIME(3);
