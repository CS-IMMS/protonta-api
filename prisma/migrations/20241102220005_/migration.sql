/*
  Warnings:

  - You are about to drop the `SensorData` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "SensorData";

-- CreateTable
CREATE TABLE "SensorDatas" (
    "id" TEXT NOT NULL,
    "latest" TEXT NOT NULL,
    "elapsed" TEXT NOT NULL,
    "localName" TEXT NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "humidity" DOUBLE PRECISION NOT NULL,
    "pressure" DOUBLE PRECISION NOT NULL,
    "light_A" DOUBLE PRECISION NOT NULL,
    "sol" DOUBLE PRECISION NOT NULL,
    "acc_x" DOUBLE PRECISION NOT NULL,
    "acc_y" DOUBLE PRECISION NOT NULL,
    "acc_z" DOUBLE PRECISION NOT NULL,
    "iaq" DOUBLE PRECISION NOT NULL,
    "gyro_x" DOUBLE PRECISION NOT NULL,
    "gyro_y" DOUBLE PRECISION NOT NULL,
    "gyro_z" DOUBLE PRECISION NOT NULL,
    "accuracy" INTEGER NOT NULL,
    "SeuilHumidity_min" DOUBLE PRECISION NOT NULL,
    "SeuilHumidity_max" DOUBLE PRECISION NOT NULL,
    "SeuilTemp_min" DOUBLE PRECISION NOT NULL,
    "SeuilTemp_max" DOUBLE PRECISION NOT NULL,
    "SeuilLum_min" DOUBLE PRECISION NOT NULL,
    "SeuilLum_max" DOUBLE PRECISION NOT NULL,
    "SeuilPression_min" DOUBLE PRECISION NOT NULL,
    "SeuilPression_max" DOUBLE PRECISION NOT NULL,
    "SeuilCo2_min" DOUBLE PRECISION NOT NULL,
    "SeuilCo2_max" DOUBLE PRECISION NOT NULL,
    "MeanTemp" DOUBLE PRECISION NOT NULL,
    "MeanHumidity" DOUBLE PRECISION NOT NULL,
    "MeanLum" DOUBLE PRECISION NOT NULL,
    "MeanPress" DOUBLE PRECISION NOT NULL,
    "MeanCo2" DOUBLE PRECISION NOT NULL,
    "S1" INTEGER NOT NULL,
    "S2" INTEGER NOT NULL,
    "S3" INTEGER NOT NULL,
    "S4" INTEGER NOT NULL,
    "S5" INTEGER NOT NULL,
    "S6" INTEGER NOT NULL,
    "S7" INTEGER NOT NULL,
    "S8" INTEGER NOT NULL,
    "S9" INTEGER NOT NULL,
    "S10" INTEGER NOT NULL,
    "S11" INTEGER NOT NULL,
    "S12" INTEGER NOT NULL,
    "S13" INTEGER NOT NULL,
    "S14" INTEGER NOT NULL,
    "S15" INTEGER NOT NULL,
    "S16" INTEGER NOT NULL,
    "MomentFloraison" BOOLEAN NOT NULL,
    "sensorDataForMinteId" TEXT,

    CONSTRAINT "SensorDatas_pkey" PRIMARY KEY ("id")
);
