/*
  Warnings:

  - You are about to drop the column `sensorDataForMinteId` on the `SensorDatas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SensorDatas" DROP COLUMN "sensorDataForMinteId";

-- CreateTable
CREATE TABLE "SensorDataForMinute" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startTimestamp" TIMESTAMP(3) NOT NULL,
    "endTimestamp" TIMESTAMP(3) NOT NULL,
    "averageTemp" DOUBLE PRECISION,
    "averageHumidity" DOUBLE PRECISION,
    "averagePressure" DOUBLE PRECISION,
    "averageLightA" DOUBLE PRECISION,
    "averageSol" DOUBLE PRECISION,
    "averageAccX" DOUBLE PRECISION,
    "averageAccY" DOUBLE PRECISION,
    "averageAccZ" DOUBLE PRECISION,
    "averageIaq" DOUBLE PRECISION,
    "averageGyroX" DOUBLE PRECISION,
    "averageGyroY" DOUBLE PRECISION,
    "averageGyroZ" DOUBLE PRECISION,
    "averageAccuracy" DOUBLE PRECISION,
    "averageSeuilHumidityMin" DOUBLE PRECISION,
    "averageSeuilHumidityMax" DOUBLE PRECISION,
    "averageSeuilTempMin" DOUBLE PRECISION,
    "averageSeuilTempMax" DOUBLE PRECISION,
    "averageSeuilLumMin" DOUBLE PRECISION,
    "averageSeuilLumMax" DOUBLE PRECISION,
    "averageSeuilPressionMin" DOUBLE PRECISION,
    "averageSeuilPressionMax" DOUBLE PRECISION,
    "averageSeuilCo2Min" DOUBLE PRECISION,
    "averageSeuilCo2Max" DOUBLE PRECISION,
    "meanTemp" DOUBLE PRECISION,
    "meanHumidity" DOUBLE PRECISION,
    "meanLum" DOUBLE PRECISION,
    "meanPress" DOUBLE PRECISION,
    "meanCo2" DOUBLE PRECISION,
    "S1" DOUBLE PRECISION[],
    "S2" DOUBLE PRECISION[],
    "S3" DOUBLE PRECISION[],
    "S4" DOUBLE PRECISION[],
    "S5" DOUBLE PRECISION[],
    "S6" DOUBLE PRECISION[],
    "S7" DOUBLE PRECISION[],
    "S8" DOUBLE PRECISION[],
    "S9" DOUBLE PRECISION[],
    "S10" DOUBLE PRECISION[],
    "S11" DOUBLE PRECISION[],
    "S12" DOUBLE PRECISION[],
    "S13" DOUBLE PRECISION[],
    "S14" DOUBLE PRECISION[],
    "S15" DOUBLE PRECISION[],
    "S16" DOUBLE PRECISION[],
    "originalDataId" TEXT,

    CONSTRAINT "SensorDataForMinute_pkey" PRIMARY KEY ("id")
);
