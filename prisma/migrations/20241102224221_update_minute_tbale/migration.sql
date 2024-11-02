/*
  Warnings:

  - Changed the type of `S1` on the `SensorDataForMinute` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `S2` on the `SensorDataForMinute` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `S3` on the `SensorDataForMinute` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `S4` on the `SensorDataForMinute` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `S5` on the `SensorDataForMinute` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `S6` on the `SensorDataForMinute` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `S7` on the `SensorDataForMinute` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `S8` on the `SensorDataForMinute` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `S9` on the `SensorDataForMinute` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `S10` on the `SensorDataForMinute` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `S11` on the `SensorDataForMinute` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `S12` on the `SensorDataForMinute` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `S13` on the `SensorDataForMinute` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `S14` on the `SensorDataForMinute` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `S15` on the `SensorDataForMinute` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `S16` on the `SensorDataForMinute` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "SensorDataForMinute" DROP COLUMN "S1",
ADD COLUMN     "S1" INTEGER NOT NULL,
DROP COLUMN "S2",
ADD COLUMN     "S2" INTEGER NOT NULL,
DROP COLUMN "S3",
ADD COLUMN     "S3" INTEGER NOT NULL,
DROP COLUMN "S4",
ADD COLUMN     "S4" INTEGER NOT NULL,
DROP COLUMN "S5",
ADD COLUMN     "S5" INTEGER NOT NULL,
DROP COLUMN "S6",
ADD COLUMN     "S6" INTEGER NOT NULL,
DROP COLUMN "S7",
ADD COLUMN     "S7" INTEGER NOT NULL,
DROP COLUMN "S8",
ADD COLUMN     "S8" INTEGER NOT NULL,
DROP COLUMN "S9",
ADD COLUMN     "S9" INTEGER NOT NULL,
DROP COLUMN "S10",
ADD COLUMN     "S10" INTEGER NOT NULL,
DROP COLUMN "S11",
ADD COLUMN     "S11" INTEGER NOT NULL,
DROP COLUMN "S12",
ADD COLUMN     "S12" INTEGER NOT NULL,
DROP COLUMN "S13",
ADD COLUMN     "S13" INTEGER NOT NULL,
DROP COLUMN "S14",
ADD COLUMN     "S14" INTEGER NOT NULL,
DROP COLUMN "S15",
ADD COLUMN     "S15" INTEGER NOT NULL,
DROP COLUMN "S16",
ADD COLUMN     "S16" INTEGER NOT NULL;
