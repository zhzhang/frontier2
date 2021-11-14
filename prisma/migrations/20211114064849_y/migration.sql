/*
  Warnings:

  - You are about to drop the column `reviewNumber` on the `Review` table. All the data in the column will be lost.
  - Added the required column `publishTimestamp` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Review` DROP COLUMN `reviewNumber`,
    ADD COLUMN `publishTimestamp` DATETIME(3) NOT NULL;
