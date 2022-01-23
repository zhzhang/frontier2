/*
  Warnings:

  - You are about to drop the column `endYear` on the `Relation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Relation` DROP COLUMN `endYear`,
    ADD COLUMN `endDate` DATETIME(3) NULL;
