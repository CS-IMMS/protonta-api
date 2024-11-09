-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('Moniteur', 'Chateau', 'SAS', 'Bipeure', 'Ombriere');

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "NotificationType" NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);
