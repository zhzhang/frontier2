-- AlterTable
ALTER TABLE `ArticleVersion` ADD COLUMN     `highlights` MEDIUMTEXT NOT NULL DEFAULT '[]';

-- AlterTable
ALTER TABLE `ThreadMessage` ADD COLUMN     `highlights` MEDIUMTEXT NOT NULL DEFAULT '[]';
