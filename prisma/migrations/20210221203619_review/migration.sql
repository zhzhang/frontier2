/*
  Warnings:

  - Added the required column `published` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "body" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "submissionId" TEXT,
    "authorId" TEXT NOT NULL,
    "reviewerNumber" INTEGER NOT NULL,
    "published" BOOLEAN NOT NULL,
    FOREIGN KEY ("articleId") REFERENCES "Article" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("submissionId") REFERENCES "Submission" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Review" ("id", "body", "articleId", "authorId", "reviewerNumber") SELECT "id", "body", "articleId", "authorId", "reviewerNumber" FROM "Review";
DROP TABLE "Review";
ALTER TABLE "new_Review" RENAME TO "Review";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
