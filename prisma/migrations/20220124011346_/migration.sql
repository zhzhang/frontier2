-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `twitter` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `profilePictureUrl` VARCHAR(191) NULL,
    `institution` VARCHAR(191) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_twitter_key`(`twitter`),
    UNIQUE INDEX `User_website_key`(`website`),
    UNIQUE INDEX `User_profilePictureUrl_key`(`profilePictureUrl`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Relation` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `targetId` VARCHAR(191) NOT NULL,
    `relation` ENUM('ADVISOR', 'ADVISEE', 'COAUTHOR', 'COWORKER', 'FAMILY', 'SOCIAL') NOT NULL,
    `endDate` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Article` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `abstract` MEDIUMTEXT NOT NULL,
    `anonymous` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Identity` (
    `id` VARCHAR(191) NOT NULL,
    `context` ENUM('AUTHOR', 'REVIEWER', 'CHAIR') NULL,
    `venueId` VARCHAR(191) NULL,
    `number` INTEGER NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `anonymized` BOOLEAN NOT NULL DEFAULT true,
    `articleId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ArticleVersion` (
    `id` VARCHAR(191) NOT NULL,
    `ref` VARCHAR(191) NULL,
    `articleId` VARCHAR(191) NOT NULL,
    `versionNumber` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ThreadMessage` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('COMMENT', 'REVIEW', 'DECISION') NOT NULL,
    `body` MEDIUMTEXT NOT NULL,
    `highlights` JSON NOT NULL,
    `authorIdentityId` VARCHAR(191) NULL,
    `authorId` VARCHAR(191) NOT NULL,
    `articleId` VARCHAR(191) NOT NULL,
    `headId` VARCHAR(191) NULL,
    `venueId` VARCHAR(191) NULL,
    `rating` JSON NULL,
    `decision` BOOLEAN NOT NULL DEFAULT false,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `publishTimestamp` DATETIME(3) NULL,
    `released` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Venue` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `acceptingSubmissions` BOOLEAN NOT NULL DEFAULT false,
    `reviewPolicy` ENUM('OPEN', 'SINGLE_BLIND', 'DOUBLE_BLIND') NOT NULL DEFAULT 'DOUBLE_BLIND',
    `reviewTemplate` MEDIUMTEXT NULL,
    `ratingFields` JSON NULL,
    `websiteUrl` VARCHAR(191) NULL,
    `abbreviation` VARCHAR(191) NULL,
    `description` MEDIUMTEXT NULL,
    `logoRef` VARCHAR(191) NULL,
    `venueDate` DATETIME(3) NULL,
    `submissionDeadline` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VenueMembership` (
    `id` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `venueId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReviewRequest` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('ROOT', 'REVIEW', 'CHAIR') NOT NULL,
    `articleId` VARCHAR(191) NOT NULL,
    `venueId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `note` VARCHAR(191) NOT NULL DEFAULT '',
    `status` ENUM('CREATED', 'RELEASED', 'ACCEPTED', 'DECLINED', 'COMPLETED') NOT NULL DEFAULT 'CREATED',
    `reviewId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ReviewRequest_reviewId_key`(`reviewId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
ALTER TABLE `VenueMembership` ADD CONSTRAINT `VenueMembership_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VenueMembership` ADD CONSTRAINT `VenueMembership_venueId_fkey` FOREIGN KEY (`venueId`) REFERENCES `Venue`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReviewRequest` ADD CONSTRAINT `ReviewRequest_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `Article`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReviewRequest` ADD CONSTRAINT `ReviewRequest_venueId_fkey` FOREIGN KEY (`venueId`) REFERENCES `Venue`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReviewRequest` ADD CONSTRAINT `ReviewRequest_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReviewRequest` ADD CONSTRAINT `ReviewRequest_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `ThreadMessage`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
