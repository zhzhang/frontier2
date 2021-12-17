-- AlterTable
ALTER TABLE `ThreadMessage` ADD COLUMN `published` BOOLEAN NOT NULL DEFAULT false,
    ALTER COLUMN `publishTimestamp` DROP DEFAULT;
