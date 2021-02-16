/*
  Warnings:

  - Made the column `articleId` on table `ArticleVersion` required. The migration will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ArticleVersion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "abstract" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("articleId") REFERENCES "Article" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ArticleVersion" ("id", "abstract", "url", "articleId", "createdAt") SELECT "id", "abstract", "url", "articleId", "createdAt" FROM "ArticleVersion";
DROP TABLE "ArticleVersion";
ALTER TABLE "new_ArticleVersion" RENAME TO "ArticleVersion";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
