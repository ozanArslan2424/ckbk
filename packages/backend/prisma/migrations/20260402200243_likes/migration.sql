-- CreateTable
CREATE TABLE "like" (
    "recipeId" INTEGER NOT NULL,
    "profileId" INTEGER NOT NULL,

    PRIMARY KEY ("recipeId", "profileId"),
    CONSTRAINT "like_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipe" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "like_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
