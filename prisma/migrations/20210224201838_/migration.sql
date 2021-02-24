/*
  Warnings:

  - Added the required column `abbreviation` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Organization" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "description" TEXT,
    "logoRef" TEXT
);
INSERT INTO "new_Organization" ("id", "name", "description", "logoRef") SELECT "id", "name", "description", "logoRef" FROM "Organization";
DROP TABLE "Organization";
ALTER TABLE "new_Organization" RENAME TO "Organization";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
