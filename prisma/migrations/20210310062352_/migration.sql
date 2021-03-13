/*
  Warnings:

  - Made the column `description` on table `Organization` required. The migration will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Organization` MODIFY `abbreviation` VARCHAR(191),
    MODIFY `description` MEDIUMTEXT NOT NULL;
