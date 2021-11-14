/*
  Warnings:

  - You are about to alter the column `highlights` on the `Decision` table. The data in that column could be lost. The data in that column will be cast from `MediumText` to `Json`.
  - You are about to alter the column `highlights` on the `Review` table. The data in that column could be lost. The data in that column will be cast from `MediumText` to `Json`.
  - You are about to alter the column `highlights` on the `ThreadMessage` table. The data in that column could be lost. The data in that column will be cast from `MediumText` to `Json`.

*/
-- AlterTable
ALTER TABLE `Decision` MODIFY `highlights` JSON NOT NULL;

-- AlterTable
ALTER TABLE `Review` MODIFY `highlights` JSON NOT NULL;

-- AlterTable
ALTER TABLE `ThreadMessage` MODIFY `highlights` JSON NOT NULL;

-- RedefineIndex
CREATE UNIQUE INDEX `Submission.decisionId_unique` ON `Submission`(`decisionId`);
DROP INDEX `Submission_decisionId_unique` ON `Submission`;
