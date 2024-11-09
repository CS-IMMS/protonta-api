/*
  Warnings:

  - You are about to drop the column `averageAccuracy` on the `SensorDataForMinute` table. All the data in the column will be lost.
  - You are about to drop the column `averageSeuilCo2Max` on the `SensorDataForMinute` table. All the data in the column will be lost.
  - You are about to drop the column `averageSeuilCo2Min` on the `SensorDataForMinute` table. All the data in the column will be lost.
  - You are about to drop the column `averageSeuilHumidityMax` on the `SensorDataForMinute` table. All the data in the column will be lost.
  - You are about to drop the column `averageSeuilHumidityMin` on the `SensorDataForMinute` table. All the data in the column will be lost.
  - You are about to drop the column `averageSeuilLumMax` on the `SensorDataForMinute` table. All the data in the column will be lost.
  - You are about to drop the column `averageSeuilLumMin` on the `SensorDataForMinute` table. All the data in the column will be lost.
  - You are about to drop the column `averageSeuilPressionMax` on the `SensorDataForMinute` table. All the data in the column will be lost.
  - You are about to drop the column `averageSeuilPressionMin` on the `SensorDataForMinute` table. All the data in the column will be lost.
  - You are about to drop the column `averageSeuilTempMax` on the `SensorDataForMinute` table. All the data in the column will be lost.
  - You are about to drop the column `averageSeuilTempMin` on the `SensorDataForMinute` table. All the data in the column will be lost.
  - You are about to drop the column `meanCo2` on the `SensorDataForMinute` table. All the data in the column will be lost.
  - You are about to drop the column `meanHumidity` on the `SensorDataForMinute` table. All the data in the column will be lost.
  - You are about to drop the column `meanLum` on the `SensorDataForMinute` table. All the data in the column will be lost.
  - You are about to drop the column `meanPress` on the `SensorDataForMinute` table. All the data in the column will be lost.
  - You are about to drop the column `meanTemp` on the `SensorDataForMinute` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SensorDataForMinute" DROP COLUMN "averageAccuracy",
DROP COLUMN "averageSeuilCo2Max",
DROP COLUMN "averageSeuilCo2Min",
DROP COLUMN "averageSeuilHumidityMax",
DROP COLUMN "averageSeuilHumidityMin",
DROP COLUMN "averageSeuilLumMax",
DROP COLUMN "averageSeuilLumMin",
DROP COLUMN "averageSeuilPressionMax",
DROP COLUMN "averageSeuilPressionMin",
DROP COLUMN "averageSeuilTempMax",
DROP COLUMN "averageSeuilTempMin",
DROP COLUMN "meanCo2",
DROP COLUMN "meanHumidity",
DROP COLUMN "meanLum",
DROP COLUMN "meanPress",
DROP COLUMN "meanTemp",
ADD COLUMN     "lastSeuilCo2Max" DOUBLE PRECISION,
ADD COLUMN     "lastSeuilCo2Min" DOUBLE PRECISION,
ADD COLUMN     "lastSeuilHumidityMax" DOUBLE PRECISION,
ADD COLUMN     "lastSeuilHumidityMin" DOUBLE PRECISION,
ADD COLUMN     "lastSeuilLumMax" DOUBLE PRECISION,
ADD COLUMN     "lastSeuilLumMin" DOUBLE PRECISION,
ADD COLUMN     "lastSeuilPressionMax" DOUBLE PRECISION,
ADD COLUMN     "lastSeuilPressionMin" DOUBLE PRECISION,
ADD COLUMN     "lastSeuilTempMax" DOUBLE PRECISION,
ADD COLUMN     "lastSeuilTempMin" DOUBLE PRECISION;
