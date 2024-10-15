/*
  Warnings:

  - You are about to drop the `ProjectVideo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ProjectVideo";
PRAGMA foreign_keys=on;

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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Project" ("addressLine1", "addressLine2", "buildingHoverImage", "buildingImageUrl", "buildingName", "centerImage", "city", "createdAt", "id", "landmark", "logoUrl", "longDescription", "name", "shortDescription", "state", "status", "street", "tagLine", "type") SELECT "addressLine1", "addressLine2", "buildingHoverImage", "buildingImageUrl", "buildingName", "centerImage", "city", "createdAt", "id", "landmark", "logoUrl", "longDescription", "name", "shortDescription", "state", "status", "street", "tagLine", "type" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE TABLE "new_About" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "heading" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "iconBigUrl" TEXT,
    "iconSmallUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_About" ("content", "createdAt", "heading", "iconBigUrl", "iconSmallUrl", "id") SELECT "content", "createdAt", "heading", "iconBigUrl", "iconSmallUrl", "id" FROM "About";
DROP TABLE "About";
ALTER TABLE "new_About" RENAME TO "About";
CREATE TABLE "new_press" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "heading" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "redirection" TEXT NOT NULL,
    "imageUrl" TEXT,
    "iconSmallUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_press" ("content", "createdAt", "heading", "iconSmallUrl", "id", "imageUrl", "redirection") SELECT "content", "createdAt", "heading", "iconSmallUrl", "id", "imageUrl", "redirection" FROM "press";
DROP TABLE "press";
ALTER TABLE "new_press" RENAME TO "press";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
