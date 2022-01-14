/*
  Warnings:

  - The `rating` column on the `ThreadMessage` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `VenueMembership` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `ArticleVersion` DROP FOREIGN KEY `articleversion_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Identity` DROP FOREIGN KEY `identity_ibfk_3`;

-- DropForeignKey
ALTER TABLE `Identity` DROP FOREIGN KEY `identity_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Identity` DROP FOREIGN KEY `identity_ibfk_2`;

-- DropForeignKey
ALTER TABLE `Relation` DROP FOREIGN KEY `relation_ibfk_2`;

-- DropForeignKey
ALTER TABLE `Relation` DROP FOREIGN KEY `relation_ibfk_1`;

-- DropForeignKey
ALTER TABLE `ReviewRequest` DROP FOREIGN KEY `reviewrequest_ibfk_1`;

-- DropForeignKey
ALTER TABLE `ReviewRequest` DROP FOREIGN KEY `reviewrequest_ibfk_2`;

-- DropForeignKey
ALTER TABLE `ReviewRequest` DROP FOREIGN KEY `reviewrequest_ibfk_3`;

-- DropForeignKey
ALTER TABLE `Submission` DROP FOREIGN KEY `submission_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Submission` DROP FOREIGN KEY `submission_ibfk_3`;

-- DropForeignKey
ALTER TABLE `Submission` DROP FOREIGN KEY `submission_ibfk_2`;

-- DropForeignKey
ALTER TABLE `ThreadMessage` DROP FOREIGN KEY `threadmessage_ibfk_3`;

-- DropForeignKey
ALTER TABLE `ThreadMessage` DROP FOREIGN KEY `threadmessage_ibfk_2`;

-- DropForeignKey
ALTER TABLE `ThreadMessage` DROP FOREIGN KEY `threadmessage_ibfk_1`;

-- DropForeignKey
ALTER TABLE `ThreadMessage` DROP FOREIGN KEY `threadmessage_ibfk_4`;

-- DropForeignKey
ALTER TABLE `VenueMembership` DROP FOREIGN KEY `venuemembership_ibfk_1`;

-- DropForeignKey
ALTER TABLE `VenueMembership` DROP FOREIGN KEY `venuemembership_ibfk_2`;

-- AlterTable
ALTER TABLE `ThreadMessage` DROP COLUMN `rating`,
    ADD COLUMN `rating` JSON NULL;

-- AlterTable
ALTER TABLE `Venue` ADD COLUMN `ratingFields` JSON NULL,
    ADD COLUMN `reviewPolicy` ENUM('OPEN', 'SINGLE_BLIND', 'DOUBLE_BLIND') NOT NULL DEFAULT 'DOUBLE_BLIND',
    ADD COLUMN `template` MEDIUMTEXT NULL;

-- AlterTable
ALTER TABLE `VenueMembership` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Relation` ADD CONSTRAINT `Relation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Relation` ADD CONSTRAINT `Relation_targetId_fkey` FOREIGN KEY (`targetId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Identity` ADD CONSTRAINT `Identity_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Identity` ADD CONSTRAINT `Identity_venueId_fkey` FOREIGN KEY (`venueId`) REFERENCES `Venue`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Identity` ADD CONSTRAINT `Identity_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `Article`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ArticleVersion` ADD CONSTRAINT `ArticleVersion_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `Article`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ThreadMessage` ADD CONSTRAINT `ThreadMessage_authorIdentityId_fkey` FOREIGN KEY (`authorIdentityId`) REFERENCES `Identity`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ThreadMessage` ADD CONSTRAINT `ThreadMessage_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ThreadMessage` ADD CONSTRAINT `ThreadMessage_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `Article`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ThreadMessage` ADD CONSTRAINT `ThreadMessage_venueId_fkey` FOREIGN KEY (`venueId`) REFERENCES `Venue`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Submission` ADD CONSTRAINT `Submission_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `Article`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Submission` ADD CONSTRAINT `Submission_venueId_fkey` FOREIGN KEY (`venueId`) REFERENCES `Venue`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Submission` ADD CONSTRAINT `Submission_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VenueMembership` ADD CONSTRAINT `VenueMembership_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VenueMembership` ADD CONSTRAINT `VenueMembership_venueId_fkey` FOREIGN KEY (`venueId`) REFERENCES `Venue`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReviewRequest` ADD CONSTRAINT `ReviewRequest_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `Article`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReviewRequest` ADD CONSTRAINT `ReviewRequest_submissionId_fkey` FOREIGN KEY (`submissionId`) REFERENCES `Submission`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReviewRequest` ADD CONSTRAINT `ReviewRequest_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `User` RENAME INDEX `User.email_unique` TO `User_email_key`;

-- RenameIndex
ALTER TABLE `User` RENAME INDEX `User.profilePictureUrl_unique` TO `User_profilePictureUrl_key`;

-- RenameIndex
ALTER TABLE `User` RENAME INDEX `User.twitter_unique` TO `User_twitter_key`;

-- RenameIndex
ALTER TABLE `User` RENAME INDEX `User.website_unique` TO `User_website_key`;
