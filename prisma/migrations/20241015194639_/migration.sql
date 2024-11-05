/*
  Warnings:

  - A unique constraint covering the columns `[position]` on the table `About` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[position]` on the table `press` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `position` to the `About` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `press` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "About" ADD COLUMN     "position" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "press" ADD COLUMN     "position" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "About_position_key" ON "About"("position");

-- CreateIndex
CREATE UNIQUE INDEX "press_position_key" ON "press"("position");
