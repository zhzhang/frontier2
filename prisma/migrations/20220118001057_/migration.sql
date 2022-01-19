/*
  Warnings:

  - You are about to alter the column `status` on the `ReviewRequest` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum("ReviewRequest_status")`.
  - You are about to drop the column `ownerId` on the `Submission` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[reviewId]` on the table `ReviewRequest` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `note` to the `ReviewRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `ReviewRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Submission` DROP FOREIGN KEY `Submission_ownerId_fkey`;

-- AlterTable
ALTER TABLE `ReviewRequest` ADD COLUMN `note` VARCHAR(191) NOT NULL,
    ADD COLUMN `reviewId` VARCHAR(191) NULL,
    ADD COLUMN `type` ENUM('REVIEW', 'CHAIR') NOT NULL,
    MODIFY `status` ENUM('CREATED', 'RELEASED', 'ACCEPTED', 'DECLINED', 'COMPLETED') NOT NULL DEFAULT 'CREATED';

-- AlterTable
ALTER TABLE `Submission` DROP COLUMN `ownerId`;

-- CreateIndex
CREATE UNIQUE INDEX `ReviewRequest_reviewId_key` ON `ReviewRequest`(`reviewId`);

-- AddForeignKey
ALTER TABLE `ReviewRequest` ADD CONSTRAINT `ReviewRequest_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `ThreadMessage`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
