/*
  Warnings:

  - You are about to drop the `Facility` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `facilityName` to the `PatientVisit` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PatientVisit" DROP CONSTRAINT "PatientVisit_facilityId_fkey";

-- AlterTable
ALTER TABLE "PatientVisit" ADD COLUMN     "facilityName" TEXT NOT NULL;

-- DropTable
DROP TABLE "Facility";
