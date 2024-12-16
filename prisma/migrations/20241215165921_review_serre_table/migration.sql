/*
  Warnings:

  - You are about to drop the column `serreId` on the `Serre` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[protentaId]` on the table `Serre` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[capteurId]` on the table `Serre` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Serre_serreId_key";

-- AlterTable
ALTER TABLE "Serre" DROP COLUMN "serreId",
ADD COLUMN     "capteurId" TEXT NOT NULL DEFAULT 'c1001',
ADD COLUMN     "name" TEXT NOT NULL DEFAULT 'principale',
ADD COLUMN     "protentaId" TEXT NOT NULL DEFAULT 'p1001';

-- CreateIndex
CREATE UNIQUE INDEX "Serre_protentaId_key" ON "Serre"("protentaId");

-- CreateIndex
CREATE UNIQUE INDEX "Serre_capteurId_key" ON "Serre"("capteurId");
