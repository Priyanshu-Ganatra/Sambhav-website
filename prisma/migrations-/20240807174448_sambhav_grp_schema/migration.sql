-- CreateTable
CREATE TABLE "Admin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Project" (
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

-- CreateTable
CREATE TABLE "Amenities" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amenity" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,
    CONSTRAINT "Amenities_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "amenityImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amenityUrl" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,
    CONSTRAINT "amenityImage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProjectImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "imageUrl" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,
    CONSTRAINT "ProjectImage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "projectData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,
    CONSTRAINT "projectData_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "About" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "heading" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "iconBigUrl" TEXT,
    "iconSmallUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "press" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "heading" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "redirection" TEXT NOT NULL,
    "imageUrl" TEXT,
    "iconSmallUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "social" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "socialMedia" TEXT NOT NULL,
    "link" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "newsletter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Project_position_key" ON "Project"("position");