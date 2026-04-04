/*
  Warnings:

  - You are about to drop the `_BookmarkToCompanyCollection` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BookmarkToCompanyCollection" DROP CONSTRAINT "_BookmarkToCompanyCollection_A_fkey";

-- DropForeignKey
ALTER TABLE "_BookmarkToCompanyCollection" DROP CONSTRAINT "_BookmarkToCompanyCollection_B_fkey";

-- DropTable
DROP TABLE "_BookmarkToCompanyCollection";

-- CreateTable
CREATE TABLE "BookmarkCompany" (
    "id" SERIAL NOT NULL,
    "bookmarkId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,
    "bookmarkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookmarkCompany_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BookmarkCompany_bookmarkId_companyId_key" ON "BookmarkCompany"("bookmarkId", "companyId");

-- AddForeignKey
ALTER TABLE "BookmarkCompany" ADD CONSTRAINT "BookmarkCompany_bookmarkId_fkey" FOREIGN KEY ("bookmarkId") REFERENCES "Bookmark"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookmarkCompany" ADD CONSTRAINT "BookmarkCompany_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "CompanyCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
