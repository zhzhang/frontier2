/*
  Warnings:

  - Added the required column `articleVersion` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `articleVersion` to the `ThreadMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Review` ADD COLUMN     `articleVersion` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `ThreadMessage` ADD COLUMN     `articleVersion` INTEGER NOT NULL;
