/*
  Warnings:

  - You are about to drop the column `visitId` on the `DiseasesOnVisit` table. All the data in the column will be lost.
  - Added the required column `patientVisitId` to the `DiseasesOnVisit` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DiseasesOnVisit" DROP CONSTRAINT "DiseasesOnVisit_visitId_fkey";

-- AlterTable
ALTER TABLE "DiseasesOnVisit" DROP COLUMN "visitId",
ADD COLUMN     "patientVisitId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "DiseasesOnVisit" ADD CONSTRAINT "DiseasesOnVisit_patientVisitId_fkey" FOREIGN KEY ("patientVisitId") REFERENCES "PatientVisit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
