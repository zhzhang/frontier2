-- CreateTable
CREATE TABLE `_DecisionToReview` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_DecisionToReview_AB_unique`(`A`, `B`),
    INDEX `_DecisionToReview_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_DecisionToReview` ADD FOREIGN KEY (`A`) REFERENCES `Decision`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DecisionToReview` ADD FOREIGN KEY (`B`) REFERENCES `Review`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
