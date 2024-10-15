/*
  Warnings:

  - You are about to drop the column `iconSmallUrl` on the `cloudinaryPublicId` table. All the data in the column will be lost.
  - Added the required column `url` to the `cloudinaryPublicId` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_cloudinaryPublicId" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL
);
INSERT INTO "new_cloudinaryPublicId" ("id", "publicId") SELECT "id", "publicId" FROM "cloudinaryPublicId";
DROP TABLE "cloudinaryPublicId";
ALTER TABLE "new_cloudinaryPublicId" RENAME TO "cloudinaryPublicId";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
