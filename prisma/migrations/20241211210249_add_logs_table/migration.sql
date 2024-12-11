-- AlterTable
ALTER TABLE "ComamandeToMonitor" ADD COLUMN     "usersLogsId" TEXT;

-- CreateTable
CREATE TABLE "UsersLogs" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usersId" TEXT NOT NULL,

    CONSTRAINT "UsersLogs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UsersLogs" ADD CONSTRAINT "UsersLogs_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComamandeToMonitor" ADD CONSTRAINT "ComamandeToMonitor_usersLogsId_fkey" FOREIGN KEY ("usersLogsId") REFERENCES "UsersLogs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
