-- AddForeignKey
ALTER TABLE "PatientVisit" ADD CONSTRAINT "PatientVisit_facilityCode_fkey" FOREIGN KEY ("facilityCode") REFERENCES "Facility"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
