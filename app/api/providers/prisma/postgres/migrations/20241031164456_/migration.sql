/*
  Warnings:

  - You are about to drop the `SkippedPatientVisit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "SkippedPatientVisit";

-- CreateTable
CREATE TABLE "Facility" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "solutionType" TEXT NOT NULL DEFAULT '',
    "divisionCode" TEXT NOT NULL DEFAULT '',
    "districtCode" TEXT NOT NULL DEFAULT '',
    "upazilaCode" TEXT NOT NULL DEFAULT '',
    "catchment" TEXT NOT NULL DEFAULT '',
    "careLevel" TEXT NOT NULL DEFAULT '',
    "ownership" TEXT NOT NULL DEFAULT '',
    "orgType" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Facility_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Facility_code_key" ON "Facility"("code");
