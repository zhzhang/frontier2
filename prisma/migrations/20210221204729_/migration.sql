/*
  Warnings:

  - You are about to drop the column `reviewerNumber` on the `Review` table. All the data in the column will be lost.
  - Added the required column `reviewNumber` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "body" TEXT NOT NULL DEFAULT '',
    "rating" INTEGER NOT NULL DEFAULT 0,
    "articleId" TEXT NOT NULL,
    "submissionId" TEXT,
    "authorId" TEXT NOT NULL,
    "reviewNumber" INTEGER NOT NULL,
    "published" BOOLEAN NOT NULL,
    FOREIGN KEY ("articleId") REFERENCES "Article" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("submissionId") REFERENCES "Submission" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Review" ("id", "body", "articleId", "submissionId", "authorId", "published") SELECT "id", "body", "articleId", "submissionId", "authorId", "published" FROM "Review";
DROP TABLE "Review";
ALTER TABLE "new_Review" RENAME TO "Review";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
