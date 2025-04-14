/*
  Warnings:

  - You are about to drop the column `diseaseName` on the `Disease` table. All the data in the column will be lost.
  - Added the required column `name` to the `Disease` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Disease" DROP COLUMN "diseaseName",
ADD COLUMN     "name" TEXT NOT NULL;
