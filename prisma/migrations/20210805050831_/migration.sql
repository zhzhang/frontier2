/*
  Warnings:

  - You are about to drop the column `reviewId` on the `ThreadMessage` table. All the data in the column will be lost.
  - You are about to alter the column `submissionDeadline` on the `Venue` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `venueDate` on the `Venue` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - Added the required column `headId` to the `ThreadMessage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ThreadMessage` DROP FOREIGN KEY `ThreadMessage_ibfk_1`;

-- AlterTable
ALTER TABLE `ThreadMessage` DROP COLUMN `reviewId`,
    ADD COLUMN `headId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Venue` MODIFY `submissionDeadline` DATETIME,
    MODIFY `venueDate` DATETIME;
