/*
  Warnings:

  - You are about to drop the column `facilityName` on the `PatientVisit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PatientVisit" DROP COLUMN "facilityName";

-- CreateTable
CREATE TABLE "Facility" (
    "id" SERIAL NOT NULL,
    "facilityId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "divisionCode" TEXT NOT NULL,
    "districtCode" TEXT NOT NULL,
    "cityCorporationCode" TEXT NOT NULL,
    "upazilaCode" TEXT NOT NULL,
    "paurasavaCode" TEXT NOT NULL,
    "unionCode" TEXT NOT NULL,
    "wardCode" TEXT NOT NULL,
    "careLevel" TEXT NOT NULL,
    "organizationType" TEXT NOT NULL,
    "organizationName" TEXT NOT NULL,
    "ownerShip" TEXT NOT NULL,
    "catchmentCode" TEXT NOT NULL,

    CONSTRAINT "Facility_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PatientVisit" ADD CONSTRAINT "PatientVisit_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
