/*
  Warnings:

  - Added the required column `lastActive` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT NOT NULL,
    "lastActive" DATETIME NOT NULL
);

-- Include CURRENT_TIMESTAMP to populate the lastActive column for existing rows
INSERT INTO "new_user" ("createdAt", "email", "emailVerified", "id", "password", "updatedAt", "lastActive") 
SELECT "createdAt", "email", "emailVerified", "id", "password", "updatedAt", CURRENT_TIMESTAMP FROM "user";

DROP TABLE "user";
ALTER TABLE "new_user" RENAME TO "user";
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
