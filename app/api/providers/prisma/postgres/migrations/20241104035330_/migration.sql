/*
  Warnings:

  - You are about to drop the column `patientSymptoms` on the `PatientVisit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DiseasesOnVisit" ADD COLUMN     "patientSymptoms" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "PatientVisit" DROP COLUMN "patientSymptoms";
