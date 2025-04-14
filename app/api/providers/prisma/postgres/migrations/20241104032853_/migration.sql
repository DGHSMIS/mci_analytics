/*
  Warnings:

  - You are about to drop the column `conceptUuId` on the `PatientVisit` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PatientVisit" DROP CONSTRAINT "PatientVisit_conceptUuId_fkey";

-- AlterTable
ALTER TABLE "PatientVisit" DROP COLUMN "conceptUuId";

-- CreateTable
CREATE TABLE "DiseasesOnVisit" (
    "id" SERIAL NOT NULL,
    "visitId" INTEGER NOT NULL,
    "conceptUuId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DiseasesOnVisit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DiseasesOnVisit" ADD CONSTRAINT "DiseasesOnVisit_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "PatientVisit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiseasesOnVisit" ADD CONSTRAINT "DiseasesOnVisit_conceptUuId_fkey" FOREIGN KEY ("conceptUuId") REFERENCES "Disease"("conceptUuId") ON DELETE RESTRICT ON UPDATE CASCADE;
