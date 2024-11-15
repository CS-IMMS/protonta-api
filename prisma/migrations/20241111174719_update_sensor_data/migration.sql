/*
  Warnings:

  - You are about to drop the column `momentFloraison` on the `SensorDataForDay` table. All the data in the column will be lost.
  - You are about to drop the column `momentFloraison` on the `SensorDataForHour` table. All the data in the column will be lost.
  - You are about to drop the column `momentFloraison` on the `SensorDataForMinute` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SensorDataForDay" DROP COLUMN "momentFloraison",
ADD COLUMN     "MomentFloraison" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "Periode" TEXT,
ADD COLUMN     "PolEndTime" TEXT,
ADD COLUMN     "PolStartTime" TEXT;

-- AlterTable
ALTER TABLE "SensorDataForHour" DROP COLUMN "momentFloraison",
ADD COLUMN     "MomentFloraison" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "Periode" TEXT,
ADD COLUMN     "PolEndTime" TEXT,
ADD COLUMN     "PolStartTime" TEXT;

-- AlterTable
ALTER TABLE "SensorDataForMinute" DROP COLUMN "momentFloraison",
ADD COLUMN     "MomentFloraison" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "Periode" TEXT,
ADD COLUMN     "PolEndTime" TEXT,
ADD COLUMN     "PolStartTime" TEXT;

-- AlterTable
ALTER TABLE "SensorDatas" ADD COLUMN     "Periode" TEXT,
ADD COLUMN     "PolEndTime" TEXT,
ADD COLUMN     "PolStartTime" TEXT,
ALTER COLUMN "MomentFloraison" SET DEFAULT false;
