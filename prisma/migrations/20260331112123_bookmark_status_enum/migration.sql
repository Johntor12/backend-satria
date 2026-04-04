/*
  Warnings:

  - The `status` column on the `Bookmark` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "BookmarkStatus" AS ENUM ('Active', 'Archived');

-- AlterTable
ALTER TABLE "Bookmark" DROP COLUMN "status",
ADD COLUMN     "status" "BookmarkStatus" NOT NULL DEFAULT 'Active';
