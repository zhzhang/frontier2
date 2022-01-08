/*
  Warnings:

  - You are about to drop the column `submissionsOpen` on the `Venue` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Venue` DROP COLUMN `submissionsOpen`,
    ADD COLUMN `acceptingSubmissions` BOOLEAN NOT NULL DEFAULT false;
