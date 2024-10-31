/*
  Warnings:

  - You are about to drop the column `facilityId` on the `NCDPayloadLogger` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "NCDPayloadLogger" DROP COLUMN "facilityId",
ADD COLUMN     "facilityCode" TEXT NOT NULL DEFAULT '';
