-- AlterTable
ALTER TABLE "Disease" ADD COLUMN     "conceptName" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "PatientVisit" ADD COLUMN     "patientSymptoms" TEXT NOT NULL DEFAULT '';
