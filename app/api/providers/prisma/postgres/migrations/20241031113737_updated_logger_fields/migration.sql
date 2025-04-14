/*
  Warnings:

  - You are about to drop the column `facility_id` on the `NCDPayloadLogger` table. All the data in the column will be lost.
  - You are about to drop the column `provider_id` on the `NCDPayloadLogger` table. All the data in the column will be lost.
  - You are about to drop the column `access_token` on the `SkippedPayloadLogger` table. All the data in the column will be lost.
  - You are about to drop the column `facility_id` on the `SkippedPayloadLogger` table. All the data in the column will be lost.
  - You are about to drop the column `payload_id` on the `SkippedPayloadLogger` table. All the data in the column will be lost.
  - You are about to drop the column `provider_id` on the `SkippedPayloadLogger` table. All the data in the column will be lost.
  - Added the required column `facilityId` to the `NCDPayloadLogger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providerId` to the `NCDPayloadLogger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accessToken` to the `SkippedPayloadLogger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `facilityId` to the `SkippedPayloadLogger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payloadId` to the `SkippedPayloadLogger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providerId` to the `SkippedPayloadLogger` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SkippedPayloadLogger" DROP CONSTRAINT "SkippedPayloadLogger_payload_id_fkey";

-- AlterTable
ALTER TABLE "NCDPayloadLogger" DROP COLUMN "facility_id",
DROP COLUMN "provider_id",
ADD COLUMN     "facilityId" INTEGER NOT NULL,
ADD COLUMN     "providerId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SkippedPayloadLogger" DROP COLUMN "access_token",
DROP COLUMN "facility_id",
DROP COLUMN "payload_id",
DROP COLUMN "provider_id",
ADD COLUMN     "accessToken" TEXT NOT NULL,
ADD COLUMN     "facilityId" INTEGER NOT NULL,
ADD COLUMN     "payloadId" INTEGER NOT NULL,
ADD COLUMN     "providerId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "SkippedPayloadLogger" ADD CONSTRAINT "SkippedPayloadLogger_payloadId_fkey" FOREIGN KEY ("payloadId") REFERENCES "NCDPayloadLogger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
