/*
  Warnings:

  - You are about to drop the column `facilityId` on the `SkippedPayloadLogger` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SkippedPayloadLogger" DROP COLUMN "facilityId",
ADD COLUMN     "facilityCode" TEXT NOT NULL DEFAULT '';
