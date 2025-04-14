/*
  Warnings:

  - Added the required column `visitId` to the `PatientVisit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PatientVisit" ADD COLUMN     "visitId" INTEGER NOT NULL;
