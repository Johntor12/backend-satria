-- CreateTable
CREATE TABLE IF NOT EXISTS "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "fullName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "User_username_key" ON "User"("username");

-- AlterTable
ALTER TABLE "CompanyCollection"
ADD COLUMN IF NOT EXISTS "userId" INTEGER;

-- AlterTable
ALTER TABLE "Bookmark"
ADD COLUMN IF NOT EXISTS "userId" INTEGER;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "CompanyCollection" LIMIT 1) AND EXISTS (SELECT 1 FROM "User" LIMIT 1) THEN
        UPDATE "CompanyCollection"
        SET "userId" = (SELECT MIN("id") FROM "User")
        WHERE "userId" IS NULL;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "Bookmark" LIMIT 1) AND EXISTS (SELECT 1 FROM "User" LIMIT 1) THEN
        UPDATE "Bookmark"
        SET "userId" = (SELECT MIN("id") FROM "User")
        WHERE "userId" IS NULL;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'CompanyCollection'
          AND column_name = 'userId'
          AND is_nullable = 'YES'
    ) AND NOT EXISTS (SELECT 1 FROM "CompanyCollection" WHERE "userId" IS NULL) THEN
        ALTER TABLE "CompanyCollection" ALTER COLUMN "userId" SET NOT NULL;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'Bookmark'
          AND column_name = 'userId'
          AND is_nullable = 'YES'
    ) AND NOT EXISTS (SELECT 1 FROM "Bookmark" WHERE "userId" IS NULL) THEN
        ALTER TABLE "Bookmark" ALTER COLUMN "userId" SET NOT NULL;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'CompanyCollection_userId_fkey'
    ) THEN
        ALTER TABLE "CompanyCollection"
        ADD CONSTRAINT "CompanyCollection_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'Bookmark_userId_fkey'
    ) THEN
        ALTER TABLE "Bookmark"
        ADD CONSTRAINT "Bookmark_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
