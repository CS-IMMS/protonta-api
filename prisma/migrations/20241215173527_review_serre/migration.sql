/*
  Warnings:

  - You are about to drop the column `usersId` on the `Serre` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Serre" DROP CONSTRAINT "Serre_usersId_fkey";

-- AlterTable
ALTER TABLE "Serre" DROP COLUMN "usersId";

-- CreateTable
CREATE TABLE "_UserSerre" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserSerre_AB_unique" ON "_UserSerre"("A", "B");

-- CreateIndex
CREATE INDEX "_UserSerre_B_index" ON "_UserSerre"("B");

-- AddForeignKey
ALTER TABLE "_UserSerre" ADD CONSTRAINT "_UserSerre_A_fkey" FOREIGN KEY ("A") REFERENCES "Serre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserSerre" ADD CONSTRAINT "_UserSerre_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
