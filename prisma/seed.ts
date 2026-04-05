import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import {
  CompanyMethod,
  toPrismaCompanyMethods,
} from "../src/constants/companyCollection";

// Load environment variables
dotenv.config();

const prismaAdapter = new PrismaPg({
  connectionString:
    process.env.DATABASE_URL ||
    `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
});

const prisma = new PrismaClient({
  adapter: prismaAdapter,
});

const USER_PASSWORD = process.env.SEED_USER_PASSWORD || "password123";

const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

type SeedCompany = {
  companyName: string;
  companyNickname: string;
  sector: string;
  riskScore: number;
  riskTier: "Critical" | "High" | "Medium" | "Low";
  etr_score: number;
  margin_score: number;
  rp_haven_score: number;
  debt_score: number;
  ownership_score: number;
  conduct_score: number;
  persistence_multiplier: number;
  methods: CompanyMethod[];
  revenue: number;
};

const companyCollectionData: SeedCompany[] = [
  {
    companyName: "TechCorp Industries",
    companyNickname: "TechCorp",
    sector: "Technology",
    riskScore: 85,
    riskTier: "Critical" as const,
    etr_score: 8.5,
    margin_score: 7.2,
    rp_haven_score: 9.1,
    debt_score: 6.8,
    ownership_score: 8.9,
    conduct_score: 7.5,
    persistence_multiplier: 1.2,
    methods: ["Transfer Pricing", "Royalty Stripping"],
    revenue: 2500000,
  },
  {
    companyName: "Global Manufacturing Ltd",
    companyNickname: "GlobalMfg",
    sector: "Manufacturing",
    riskScore: 72,
    riskTier: "High" as const,
    etr_score: 6.2,
    margin_score: 8.1,
    rp_haven_score: 7.8,
    debt_score: 8.5,
    ownership_score: 6.9,
    conduct_score: 8.2,
    persistence_multiplier: 1.1,
    methods: ["Transfer Pricing", "Debt Shifting"],
    revenue: 1800000,
  },
  {
    companyName: "Retail Solutions Inc",
    companyNickname: "RetailSol",
    sector: "Retail",
    riskScore: 45,
    riskTier: "Medium" as const,
    etr_score: 4.5,
    margin_score: 5.8,
    rp_haven_score: 4.2,
    debt_score: 5.1,
    ownership_score: 4.8,
    conduct_score: 5.9,
    persistence_multiplier: 1.0,
    methods: ["Transfer Pricing"],
    revenue: 950000,
  },
  {
    companyName: "Healthcare Systems Corp",
    companyNickname: "HealthSys",
    sector: "Healthcare",
    riskScore: 28,
    riskTier: "Low" as const,
    etr_score: 2.8,
    margin_score: 3.2,
    rp_haven_score: 2.9,
    debt_score: 3.1,
    ownership_score: 2.5,
    conduct_score: 3.8,
    persistence_multiplier: 0.9,
    methods: ["Shell Layering"],
    revenue: 750000,
  },
  {
    companyName: "Energy Solutions Group",
    companyNickname: "EnergySol",
    sector: "Energy",
    riskScore: 68,
    riskTier: "High" as const,
    etr_score: 7.1,
    margin_score: 6.8,
    rp_haven_score: 8.2,
    debt_score: 7.5,
    ownership_score: 7.9,
    conduct_score: 6.7,
    persistence_multiplier: 1.15,
    methods: ["Transfer Pricing", "Royalty Stripping", "Debt Shifting"],
    revenue: 3200000,
  },
  {
    companyName: "Financial Services Hub",
    companyNickname: "FinHub",
    sector: "Financial Services",
    riskScore: 55,
    riskTier: "Medium" as const,
    etr_score: 5.5,
    margin_score: 6.2,
    rp_haven_score: 5.8,
    debt_score: 5.9,
    ownership_score: 5.1,
    conduct_score: 6.4,
    persistence_multiplier: 1.05,
    methods: ["Transfer Pricing", "Shell Layering"],
    revenue: 1400000,
  },
  {
    companyName: "Construction & Building Co",
    companyNickname: "BuildCo",
    sector: "Construction",
    riskScore: 38,
    riskTier: "Low" as const,
    etr_score: 3.8,
    margin_score: 4.1,
    rp_haven_score: 3.9,
    debt_score: 4.2,
    ownership_score: 3.5,
    conduct_score: 4.7,
    persistence_multiplier: 0.95,
    methods: ["Debt Shifting"],
    revenue: 600000,
  },
  {
    companyName: "Pharmaceutical Innovations",
    companyNickname: "PharmaInnov",
    sector: "Pharmaceutical",
    riskScore: 78,
    riskTier: "High" as const,
    etr_score: 7.8,
    margin_score: 8.5,
    rp_haven_score: 8.9,
    debt_score: 7.2,
    ownership_score: 8.1,
    conduct_score: 7.8,
    persistence_multiplier: 1.25,
    methods: ["Transfer Pricing", "Royalty Stripping"],
    revenue: 2800000,
  },
  {
    companyName: "Transportation Networks",
    companyNickname: "TransNet",
    sector: "Transportation",
    riskScore: 42,
    riskTier: "Medium" as const,
    etr_score: 4.2,
    margin_score: 4.8,
    rp_haven_score: 4.5,
    debt_score: 4.9,
    ownership_score: 4.1,
    conduct_score: 5.2,
    persistence_multiplier: 1.0,
    methods: ["Transfer Pricing", "Debt Shifting"],
    revenue: 1100000,
  },
  {
    companyName: "Agriculture Tech Solutions",
    companyNickname: "AgriTech",
    sector: "Agriculture",
    riskScore: 25,
    riskTier: "Low" as const,
    etr_score: 2.5,
    margin_score: 2.8,
    rp_haven_score: 2.6,
    debt_score: 2.9,
    ownership_score: 2.2,
    conduct_score: 3.1,
    persistence_multiplier: 0.85,
    methods: ["Shell Layering"],
    revenue: 450000,
  },
];

async function main() {
  console.log("🌱 Starting CompanyCollection seeder...");

  const hashedPassword = await hashPassword(USER_PASSWORD);
  const seedUser = await prisma.user.upsert({
    where: { email: "seeduser@example.com" },
    update: {},
    create: {
      email: "seeduser@example.com",
      username: "seeduser",
      password: hashedPassword,
      fullName: "Seed User",
    },
  });

  console.log(`👤 Seed user ready: ${seedUser.email}`);

  // Clear existing data
  await prisma.bookmarkCompany.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.companyCollection.deleteMany();
  console.log("🗑️  Cleared existing CompanyCollection data, and bookmarks");

  // Insert new data
  for (const company of companyCollectionData) {
    await prisma.companyCollection.create({
      data: {
        ...company,
        methods: toPrismaCompanyMethods(company.methods),
        userId: seedUser.id,
      },
    });
  }

  console.log(
    `✅ Successfully seeded ${companyCollectionData.length} CompanyCollection records`,
  );
  console.log("📊 Seeder completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
