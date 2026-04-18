-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_recipe" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "profileId" INTEGER,
    CONSTRAINT "recipe_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profile" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_recipe" ("createdAt", "description", "id", "profileId", "title", "updatedAt") SELECT "createdAt", "description", "id", "profileId", "title", "updatedAt" FROM "recipe";
DROP TABLE "recipe";
ALTER TABLE "new_recipe" RENAME TO "recipe";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
