/*
  Warnings:

  - You are about to drop the column `accessToken` on the `NCDPayloadLogger` table. All the data in the column will be lost.
  - Added the required column `accessoken` to the `NCDPayloadLogger` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NCDPayloadLogger" DROP COLUMN "accessToken",
ADD COLUMN     "accessoken" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SkippedPayloadLogger" ADD COLUMN     "message" TEXT NOT NULL DEFAULT '';
