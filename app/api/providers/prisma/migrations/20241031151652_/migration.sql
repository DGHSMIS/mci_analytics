/*
  Warnings:

  - You are about to drop the column `facilityId` on the `PatientVisit` table. All the data in the column will be lost.
  - You are about to drop the column `facilityName` on the `PatientVisit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PatientVisit" DROP COLUMN "facilityId",
DROP COLUMN "facilityName",
ADD COLUMN     "facilityCode" TEXT NOT NULL DEFAULT '';
