/*
  Warnings:

  - Changed the type of `latest` on the `SensorData` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "SensorData" DROP COLUMN "latest",
ADD COLUMN     "latest" TIMESTAMP(3) NOT NULL;
