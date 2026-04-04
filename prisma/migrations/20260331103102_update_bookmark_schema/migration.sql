/*
  Warnings:

  - You are about to drop the `BookmarkCollection` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "BookmarkCollection";

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "status" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "CompanyCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
