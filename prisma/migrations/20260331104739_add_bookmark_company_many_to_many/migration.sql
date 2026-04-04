/*
  Warnings:

  - You are about to drop the `BookmarkCollection` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "BookmarkCollection";

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BookmarkToCompanyCollection" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_BookmarkToCompanyCollection_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_BookmarkToCompanyCollection_B_index" ON "_BookmarkToCompanyCollection"("B");

-- AddForeignKey
ALTER TABLE "_BookmarkToCompanyCollection" ADD CONSTRAINT "_BookmarkToCompanyCollection_A_fkey" FOREIGN KEY ("A") REFERENCES "Bookmark"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookmarkToCompanyCollection" ADD CONSTRAINT "_BookmarkToCompanyCollection_B_fkey" FOREIGN KEY ("B") REFERENCES "CompanyCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
