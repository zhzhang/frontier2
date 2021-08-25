/*
  Warnings:

  - Added the required column `articleId` to the `ThreadMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ThreadMessage` ADD COLUMN `articleId` VARCHAR(191) NOT NULL,
    MODIFY `headId` VARCHAR(191);
