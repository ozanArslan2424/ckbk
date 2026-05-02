/*
  Warnings:

  - Added the required column `language` to the `ingredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language` to the `material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language` to the `measurement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language` to the `recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language` to the `step` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ingredient" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "language" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "recipeId" INTEGER,
    "materialId" INTEGER NOT NULL,
    "measurementId" INTEGER NOT NULL,
    CONSTRAINT "ingredient_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipe" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ingredient_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "material" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ingredient_measurementId_fkey" FOREIGN KEY ("measurementId") REFERENCES "measurement" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ingredient" ("createdAt", "id", "materialId", "measurementId", "quantity", "recipeId", "updatedAt") SELECT "createdAt", "id", "materialId", "measurementId", "quantity", "recipeId", "updatedAt" FROM "ingredient";
DROP TABLE "ingredient";
ALTER TABLE "new_ingredient" RENAME TO "ingredient";
CREATE UNIQUE INDEX "ingredient_recipeId_materialId_key" ON "ingredient"("recipeId", "materialId");
CREATE TABLE "new_material" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT
);
INSERT INTO "new_material" ("createdAt", "description", "id", "title", "updatedAt") SELECT "createdAt", "description", "id", "title", "updatedAt" FROM "material";
DROP TABLE "material";
ALTER TABLE "new_material" RENAME TO "material";
CREATE TABLE "new_measurement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT
);
INSERT INTO "new_measurement" ("createdAt", "description", "id", "title", "updatedAt") SELECT "createdAt", "description", "id", "title", "updatedAt" FROM "measurement";
DROP TABLE "measurement";
ALTER TABLE "new_measurement" RENAME TO "measurement";
CREATE TABLE "new_recipe" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "profileId" INTEGER NOT NULL,
    CONSTRAINT "recipe_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_recipe" ("createdAt", "description", "id", "image", "isPublic", "profileId", "title", "updatedAt") SELECT "createdAt", "description", "id", "image", "isPublic", "profileId", "title", "updatedAt" FROM "recipe";
DROP TABLE "recipe";
ALTER TABLE "new_recipe" RENAME TO "recipe";
CREATE TABLE "new_step" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "language" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "body" TEXT NOT NULL,
    "recipeId" INTEGER NOT NULL,
    CONSTRAINT "step_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipe" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_step" ("body", "createdAt", "id", "order", "recipeId", "updatedAt") SELECT "body", "createdAt", "id", "order", "recipeId", "updatedAt" FROM "step";
DROP TABLE "step";
ALTER TABLE "new_step" RENAME TO "step";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
