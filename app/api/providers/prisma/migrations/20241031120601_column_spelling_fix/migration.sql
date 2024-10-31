/*
  Warnings:

  - You are about to drop the column `accesstoken` on the `NCDPayloadLogger` table. All the data in the column will be lost.
  - Added the required column `accessToken` to the `NCDPayloadLogger` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NCDPayloadLogger" DROP COLUMN "accesstoken",
ADD COLUMN     "accessToken" TEXT NOT NULL;
