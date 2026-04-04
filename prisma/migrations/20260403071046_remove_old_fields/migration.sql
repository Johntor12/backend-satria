/*
  Warnings:

  - You are about to drop the column `etr` on the `CompanyCollection` table. All the data in the column will be lost.
  - You are about to drop the column `gap` on the `CompanyCollection` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CompanyCollection" DROP COLUMN "etr",
DROP COLUMN "gap";
