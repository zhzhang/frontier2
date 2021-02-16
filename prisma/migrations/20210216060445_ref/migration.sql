/*
  Warnings:

  - You are about to drop the column `url` on the `ArticleVersion` table. All the data in the column will be lost.
  - Added the required column `ref` to the `ArticleVersion` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ArticleVersion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "abstract" TEXT NOT NULL,
    "ref" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("articleId") REFERENCES "Article" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ArticleVersion" ("id", "abstract", "articleId", "createdAt") SELECT "id", "abstract", "articleId", "createdAt" FROM "ArticleVersion";
DROP TABLE "ArticleVersion";
ALTER TABLE "new_ArticleVersion" RENAME TO "ArticleVersion";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
