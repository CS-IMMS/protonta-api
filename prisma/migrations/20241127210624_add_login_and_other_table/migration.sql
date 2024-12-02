/*
  Warnings:

  - A unique constraint covering the columns `[sensorDataForMinuteId]` on the table `SensorDatas` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sensorDataForHourId]` on the table `SensorDatas` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sensorDataForDayId]` on the table `SensorDatas` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sensorDataForDayId` to the `SensorDatas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sensorDataForHourId` to the `SensorDatas` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER', 'SUDO', 'EXPERT');

-- AlterTable
ALTER TABLE "SensorDatas" ADD COLUMN     "cultureInfosId" TEXT,
ADD COLUMN     "sensorDataForDayId" TEXT NOT NULL,
ADD COLUMN     "sensorDataForHourId" TEXT NOT NULL,
ADD COLUMN     "sensorDataForMinuteId" TEXT;

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "userName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Serre" (
    "id" TEXT NOT NULL,
    "serreId" TEXT NOT NULL,
    "usersId" TEXT NOT NULL,
    "sensorDatasId" TEXT NOT NULL,

    CONSTRAINT "Serre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CultureInfos" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "variety" TEXT,
    "type" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startProduction" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endProduction" TIMESTAMP(3),
    "productionIsEnded" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "initialConfigId" TEXT,
    "serreId" TEXT,

    CONSTRAINT "CultureInfos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "capteurInfo" (
    "id" TEXT NOT NULL,
    "S1" BOOLEAN NOT NULL DEFAULT false,
    "descriptionS1" TEXT,
    "S2" BOOLEAN NOT NULL DEFAULT false,
    "descriptionS2" TEXT,
    "S3" BOOLEAN NOT NULL DEFAULT false,
    "descriptionS3" TEXT,
    "S4" BOOLEAN NOT NULL DEFAULT false,
    "descriptionS4" TEXT,
    "S5" BOOLEAN NOT NULL DEFAULT false,
    "descriptionS5" TEXT,
    "S6" BOOLEAN NOT NULL DEFAULT false,
    "descriptionS6" TEXT,
    "S7" BOOLEAN NOT NULL DEFAULT false,
    "descriptionS7" TEXT,
    "S8" BOOLEAN NOT NULL DEFAULT false,
    "descriptionS8" TEXT,
    "S9" BOOLEAN NOT NULL DEFAULT false,
    "descriptionS9" TEXT,
    "S10" BOOLEAN NOT NULL DEFAULT false,
    "descriptionS10" TEXT,
    "S11" BOOLEAN NOT NULL DEFAULT false,
    "descriptionS11" TEXT,
    "S12" BOOLEAN NOT NULL DEFAULT false,
    "descriptionS12" TEXT,
    "S13" BOOLEAN NOT NULL DEFAULT false,
    "descriptionS13" TEXT,
    "S14" BOOLEAN NOT NULL DEFAULT false,
    "descriptionS14" TEXT,
    "S15" BOOLEAN NOT NULL DEFAULT false,
    "descriptionS15" TEXT,
    "S16" BOOLEAN NOT NULL DEFAULT false,
    "descriptionS16" TEXT,
    "inititalConfigId" TEXT,

    CONSTRAINT "capteurInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inititalConfig" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "HumMin" INTEGER,
    "HumMax" INTEGER,
    "TemMin" INTEGER,
    "TemMax" INTEGER,
    "LumMin" INTEGER,
    "LumMax" INTEGER,
    "PressMin" INTEGER,
    "PressMax" INTEGER,
    "Co2Min" INTEGER,
    "Co2Max" INTEGER,
    "PolStartTime" TEXT,
    "PolEndTime" TEXT,
    "Periode" INTEGER,
    "MomentFloraison" BOOLEAN,

    CONSTRAINT "inititalConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Serre_serreId_key" ON "Serre"("serreId");

-- CreateIndex
CREATE UNIQUE INDEX "Serre_sensorDatasId_key" ON "Serre"("sensorDatasId");

-- CreateIndex
CREATE UNIQUE INDEX "CultureInfos_initialConfigId_key" ON "CultureInfos"("initialConfigId");

-- CreateIndex
CREATE UNIQUE INDEX "SensorDatas_sensorDataForMinuteId_key" ON "SensorDatas"("sensorDataForMinuteId");

-- CreateIndex
CREATE UNIQUE INDEX "SensorDatas_sensorDataForHourId_key" ON "SensorDatas"("sensorDataForHourId");

-- CreateIndex
CREATE UNIQUE INDEX "SensorDatas_sensorDataForDayId_key" ON "SensorDatas"("sensorDataForDayId");

-- AddForeignKey
ALTER TABLE "Serre" ADD CONSTRAINT "Serre_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Serre" ADD CONSTRAINT "Serre_sensorDatasId_fkey" FOREIGN KEY ("sensorDatasId") REFERENCES "SensorDatas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CultureInfos" ADD CONSTRAINT "CultureInfos_initialConfigId_fkey" FOREIGN KEY ("initialConfigId") REFERENCES "inititalConfig"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CultureInfos" ADD CONSTRAINT "CultureInfos_serreId_fkey" FOREIGN KEY ("serreId") REFERENCES "Serre"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "capteurInfo" ADD CONSTRAINT "capteurInfo_inititalConfigId_fkey" FOREIGN KEY ("inititalConfigId") REFERENCES "inititalConfig"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SensorDatas" ADD CONSTRAINT "SensorDatas_cultureInfosId_fkey" FOREIGN KEY ("cultureInfosId") REFERENCES "CultureInfos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SensorDatas" ADD CONSTRAINT "SensorDatas_sensorDataForMinuteId_fkey" FOREIGN KEY ("sensorDataForMinuteId") REFERENCES "SensorDataForMinute"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SensorDatas" ADD CONSTRAINT "SensorDatas_sensorDataForHourId_fkey" FOREIGN KEY ("sensorDataForHourId") REFERENCES "SensorDataForHour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SensorDatas" ADD CONSTRAINT "SensorDatas_sensorDataForDayId_fkey" FOREIGN KEY ("sensorDataForDayId") REFERENCES "SensorDataForDay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
