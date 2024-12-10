/*
  Warnings:

  - You are about to drop the column `PeriodePol` on the `SensorDatas` table. All the data in the column will be lost.
  - You are about to drop the column `pollinationEndTime` on the `SensorDatas` table. All the data in the column will be lost.
  - You are about to drop the column `pollinationStartTime` on the `SensorDatas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SensorDatas" DROP COLUMN "PeriodePol",
DROP COLUMN "pollinationEndTime",
DROP COLUMN "pollinationStartTime";
