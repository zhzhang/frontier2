/*
  Warnings:

  - You are about to drop the column `template` on the `Venue` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Venue` DROP COLUMN `template`,
    ADD COLUMN `reviewTemplate` MEDIUMTEXT NULL;
