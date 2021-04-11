/*
  Warnings:

  - You are about to drop the column `highlights` on the `ArticleVersion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `ArticleVersion` DROP COLUMN `highlights`;

-- AlterTable
ALTER TABLE `Review` ADD COLUMN     `highlights` MEDIUMTEXT NOT NULL DEFAULT '[]';
