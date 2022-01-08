/*
  Warnings:

  - The `submissionOpen` column on the `Venue` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE `Venue` DROP COLUMN `submissionOpen`,
    ADD COLUMN `submissionOpen` BOOLEAN NOT NULL DEFAULT false;
