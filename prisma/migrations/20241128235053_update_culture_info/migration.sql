-- AlterTable
ALTER TABLE "CultureInfos" ALTER COLUMN "startProduction" DROP DEFAULT,
ALTER COLUMN "startProduction" SET DATA TYPE TEXT,
ALTER COLUMN "endProduction" SET DATA TYPE TEXT;
