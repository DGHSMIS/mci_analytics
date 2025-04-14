/*
  Warnings:

  - You are about to drop the column `conceptId` on the `Disease` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Disease` table. All the data in the column will be lost.
  - You are about to drop the column `diseaseId` on the `PatientVisit` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[conceptUuId]` on the table `Disease` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `conceptUuId` to the `Disease` table without a default value. This is not possible if the table is not empty.
  - Added the required column `conceptUuId` to the `PatientVisit` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PatientVisit" DROP CONSTRAINT "PatientVisit_diseaseId_fkey";

-- DropIndex
DROP INDEX "Disease_name_key";

-- AlterTable
ALTER TABLE "Disease" DROP COLUMN "conceptId",
DROP COLUMN "name",
ADD COLUMN     "conceptUuId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PatientVisit" DROP COLUMN "diseaseId",
ADD COLUMN     "conceptUuId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Disease_conceptUuId_key" ON "Disease"("conceptUuId");

-- AddForeignKey
ALTER TABLE "PatientVisit" ADD CONSTRAINT "PatientVisit_conceptUuId_fkey" FOREIGN KEY ("conceptUuId") REFERENCES "Disease"("conceptUuId") ON DELETE RESTRICT ON UPDATE CASCADE;
