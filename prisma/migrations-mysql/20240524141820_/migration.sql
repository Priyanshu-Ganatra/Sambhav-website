/*
  Warnings:

  - Made the column `position` on table `Project` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "buildingName" TEXT NOT NULL,
    "buildingImageUrl" TEXT NOT NULL,
    "centerImage" TEXT,
    "buildingHoverImage" TEXT,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "street" TEXT,
    "landmark" TEXT,
    "city" TEXT,
    "state" TEXT,
    "type" TEXT,
    "status" TEXT,
    "logoUrl" TEXT,
    "tagLine" TEXT,
    "shortDescription" TEXT,
    "longDescription" TEXT,
    "position" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Project" ("addressLine1", "addressLine2", "buildingHoverImage", "buildingImageUrl", "buildingName", "centerImage", "city", "createdAt", "id", "landmark", "logoUrl", "longDescription", "name", "position", "shortDescription", "state", "status", "street", "tagLine", "type") SELECT "addressLine1", "addressLine2", "buildingHoverImage", "buildingImageUrl", "buildingName", "centerImage", "city", "createdAt", "id", "landmark", "logoUrl", "longDescription", "name", "position", "shortDescription", "state", "status", "street", "tagLine", "type" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE UNIQUE INDEX "Project_position_key" ON "Project"("position");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
