-- AlterTable
ALTER TABLE `Identity` ADD COLUMN `venueId` VARCHAR(191);

-- AddForeignKey
ALTER TABLE `Identity` ADD FOREIGN KEY (`venueId`) REFERENCES `Venue`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
