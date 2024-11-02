/*
  Warnings:

  - Added the required column `momentFloraison` to the `SensorDataForMinute` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SensorDataForMinute" ADD COLUMN     "momentFloraison" BOOLEAN NOT NULL;
