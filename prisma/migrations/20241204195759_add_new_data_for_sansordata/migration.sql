-- AlterTable
ALTER TABLE "SensorDataForDay" ADD COLUMN     "accuracy" INTEGER,
ADD COLUMN     "co2" INTEGER,
ADD COLUMN     "gaz" INTEGER;

-- AlterTable
ALTER TABLE "SensorDataForHour" ADD COLUMN     "accuracy" INTEGER,
ADD COLUMN     "co2" INTEGER,
ADD COLUMN     "gaz" INTEGER;

-- AlterTable
ALTER TABLE "SensorDataForMinute" ADD COLUMN     "accuracy" INTEGER,
ADD COLUMN     "co2" INTEGER,
ADD COLUMN     "gaz" INTEGER;

-- AlterTable
ALTER TABLE "SensorDatas" ADD COLUMN     "co2" INTEGER,
ADD COLUMN     "gaz" INTEGER;
