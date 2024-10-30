-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female', 'Other');

-- CreateEnum
CREATE TYPE "ServiceLocation" AS ENUM ('IPD', 'OPD', 'Emergency');

-- CreateTable
CREATE TABLE "PatientVisit" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "patientName" TEXT NOT NULL,
    "dateOfVisit" TIMESTAMP(3) NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "facilityId" INTEGER NOT NULL,
    "serviceLocation" "ServiceLocation" NOT NULL,
    "diseaseId" INTEGER NOT NULL,
    "isReferredToHigherFacility" BOOLEAN NOT NULL,
    "isFollowUp" BOOLEAN NOT NULL,

    CONSTRAINT "PatientVisit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Disease" (
    "id" SERIAL NOT NULL,
    "diseaseName" TEXT NOT NULL,

    CONSTRAINT "Disease_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PatientVisit" ADD CONSTRAINT "PatientVisit_diseaseId_fkey" FOREIGN KEY ("diseaseId") REFERENCES "Disease"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
