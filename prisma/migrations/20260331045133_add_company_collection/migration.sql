-- CreateEnum
CREATE TYPE "RiskTier" AS ENUM ('Critical', 'High', 'Medium', 'Low');

-- CreateTable
CREATE TABLE "CompanyCollection" (
    "id" SERIAL NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyNickname" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "riskScore" INTEGER NOT NULL,
    "riskTier" "RiskTier" NOT NULL,
    "etr" INTEGER NOT NULL,
    "gap" INTEGER NOT NULL,
    "methods" TEXT[],
    "revenue" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyCollection_pkey" PRIMARY KEY ("id")
);
