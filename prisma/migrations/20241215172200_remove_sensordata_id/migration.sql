/*
  Warnings:

  - You are about to drop the column `sensorDatasId` on the `Serre` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Serre_sensorDatasId_key";

-- AlterTable
ALTER TABLE "Serre" DROP COLUMN "sensorDatasId";
