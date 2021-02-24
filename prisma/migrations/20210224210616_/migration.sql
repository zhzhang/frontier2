-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "body" TEXT NOT NULL DEFAULT '',
    "rating" INTEGER NOT NULL DEFAULT 0,
    "articleId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "organizationId" TEXT,
    "reviewNumber" INTEGER NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "canAccess" BOOLEAN NOT NULL DEFAULT true,
    "metaReviewId" TEXT,
    FOREIGN KEY ("articleId") REFERENCES "Article" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("metaReviewId") REFERENCES "MetaReview" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Review" ("id", "body", "rating", "articleId", "authorId", "organizationId", "reviewNumber", "published", "metaReviewId") SELECT "id", "body", "rating", "articleId", "authorId", "organizationId", "reviewNumber", "published", "metaReviewId" FROM "Review";
DROP TABLE "Review";
ALTER TABLE "new_Review" RENAME TO "Review";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
