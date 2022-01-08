/*
  Warnings:

  - You are about to drop the column `submissionOpen` on the `Venue` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Venue` DROP COLUMN `submissionOpen`,
    ADD COLUMN `submissionsOpen` BOOLEAN NOT NULL DEFAULT false;
