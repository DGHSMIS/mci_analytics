-- CreateTable
CREATE TABLE "NCDPayloadLogger" (
    "id" SERIAL NOT NULL,
    "payload" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "provider_id" INTEGER NOT NULL,
    "facility_id" INTEGER NOT NULL,
    "access_token" TEXT NOT NULL,

    CONSTRAINT "NCDPayloadLogger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkippedPayloadLogger" (
    "id" SERIAL NOT NULL,
    "skippedItems" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payload_id" INTEGER NOT NULL,
    "provider_id" INTEGER NOT NULL,
    "facility_id" INTEGER NOT NULL,
    "access_token" TEXT NOT NULL,

    CONSTRAINT "SkippedPayloadLogger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkippedPatientVisit" (
    "id" SERIAL NOT NULL,
    "jsonObject" TEXT NOT NULL,

    CONSTRAINT "SkippedPatientVisit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SkippedPayloadLogger" ADD CONSTRAINT "SkippedPayloadLogger_payload_id_fkey" FOREIGN KEY ("payload_id") REFERENCES "NCDPayloadLogger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
