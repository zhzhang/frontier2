/*
  Warnings:

  - You are about to drop the `_DecisionToReview` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_DecisionToReview` DROP FOREIGN KEY `_DecisionToReview_ibfk_1`;

-- DropForeignKey
ALTER TABLE `_DecisionToReview` DROP FOREIGN KEY `_DecisionToReview_ibfk_2`;

-- DropTable
DROP TABLE `_DecisionToReview`;
