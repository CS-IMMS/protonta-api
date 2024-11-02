-- AlterTable
ALTER TABLE "SensorData" ADD COLUMN     "sensorDataForMinteId" TEXT,
ALTER COLUMN "elapsed" SET DATA TYPE TEXT,
ALTER COLUMN "latest" SET DATA TYPE TEXT;
