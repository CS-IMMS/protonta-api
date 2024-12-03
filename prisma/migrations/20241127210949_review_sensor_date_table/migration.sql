-- DropForeignKey
ALTER TABLE "SensorDatas" DROP CONSTRAINT "SensorDatas_sensorDataForDayId_fkey";

-- DropForeignKey
ALTER TABLE "SensorDatas" DROP CONSTRAINT "SensorDatas_sensorDataForHourId_fkey";

-- AlterTable
ALTER TABLE "SensorDatas" ALTER COLUMN "sensorDataForDayId" DROP NOT NULL,
ALTER COLUMN "sensorDataForHourId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "SensorDatas" ADD CONSTRAINT "SensorDatas_sensorDataForHourId_fkey" FOREIGN KEY ("sensorDataForHourId") REFERENCES "SensorDataForHour"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SensorDatas" ADD CONSTRAINT "SensorDatas_sensorDataForDayId_fkey" FOREIGN KEY ("sensorDataForDayId") REFERENCES "SensorDataForDay"("id") ON DELETE SET NULL ON UPDATE CASCADE;
