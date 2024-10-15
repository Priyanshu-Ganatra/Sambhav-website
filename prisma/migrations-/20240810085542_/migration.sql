/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `cloudinaryPublicId` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[publicId]` on the table `cloudinaryPublicId` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "cloudinaryPublicId_url_key" ON "cloudinaryPublicId"("url");

-- CreateIndex
CREATE UNIQUE INDEX "cloudinaryPublicId_publicId_key" ON "cloudinaryPublicId"("publicId");
