import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import {
  CompanyMethod,
  toPrismaCompanyMethods,
} from "../src/constants/companyCollection";

type BookmarkStatusType = "Active" | "Archived";

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
    etr_score: 8.5,
    margin_score: 7.2,
    rp_haven_score: 9.1,
    debt_score: 6.8,
    ownership_score: 8.9,
    conduct_score: 7.5,
    persistence_multiplier: 1.2,
    methods: ["Transfer Pricing"],
    revenue: 950000,
  },
  {
    companyName: "Energy Solutions Group",
    companyNickname: "EnergySol",
    sector: "Energy",
    riskScore: 78,
    riskTier: "High" as const,
    etr_score: 6.2,
    margin_score: 8.1,
    rp_haven_score: 7.8,
    debt_score: 8.5,
    ownership_score: 6.9,
    conduct_score: 8.2,
    persistence_multiplier: 1.1,
    methods: ["Transfer Pricing", "Debt Shifting", "Royalty Stripping"],
    revenue: 3200000,
  },
  {
    companyName: "Pharmaceutical Innovations",
    companyNickname: "PharmaInnov",
    sector: "Healthcare",
    riskScore: 62,
    riskTier: "High" as const,
    etr_score: 4.5,
    margin_score: 5.8,
    rp_haven_score: 4.2,
    debt_score: 5.1,
    ownership_score: 4.8,
    conduct_score: 5.9,
    persistence_multiplier: 1.0,
    methods: ["Transfer Pricing", "Royalty Stripping"],
    revenue: 4100000,
  },
  {
    companyName: "Financial Services Corp",
    companyNickname: "FinServ",
    sector: "Financial Services",
    riskScore: 88,
    riskTier: "Critical" as const,
    etr_score: 7.1,
    margin_score: 6.8,
    rp_haven_score: 8.2,
    debt_score: 7.5,
    ownership_score: 7.9,
    conduct_score: 6.7,
    persistence_multiplier: 1.15,
    methods: [
      "Transfer Pricing",
      "Debt Shifting",
      "Shell Layering",
      "Royalty Stripping",
    ],
    revenue: 5500000,
  },
  {
    companyName: "Construction Holdings",
    companyNickname: "ConstructHold",
    sector: "Construction",
    riskScore: 35,
    riskTier: "Low" as const,
    etr_score: 7.8,
    margin_score: 8.5,
    rp_haven_score: 8.9,
    debt_score: 7.2,
    ownership_score: 8.1,
    conduct_score: 7.8,
    persistence_multiplier: 1.25,
    methods: ["Transfer Pricing"],
    revenue: 1200000,
  },
  {
    companyName: "Logistics Network Inc",
    companyNickname: "LogiNet",
    sector: "Transportation",
    riskScore: 55,
    riskTier: "Medium" as const,
    etr_score: 5.5,
    margin_score: 6.2,
    rp_haven_score: 5.8,
    debt_score: 5.9,
    ownership_score: 5.1,
    conduct_score: 6.4,
    persistence_multiplier: 1.05,
    methods: ["Transfer Pricing", "Debt Shifting"],
    revenue: 1800000,
  },
  {
    companyName: "Media Group International",
    companyNickname: "MediaIntl",
    sector: "Media",
    riskScore: 41,
    riskTier: "Medium" as const,
    etr_score: 4.1,
    margin_score: 5.0,
    rp_haven_score: 4.4,
    debt_score: 4.6,
    ownership_score: 4.0,
    conduct_score: 5.1,
    persistence_multiplier: 1.0,
    methods: ["Transfer Pricing"],
    revenue: 850000,
  },
  {
    companyName: "Agriculture Tech Ltd",
    companyNickname: "AgriTech",
    sector: "Agriculture",
    riskScore: 29,
    riskTier: "Low" as const,
    etr_score: 2.5,
    margin_score: 2.8,
    rp_haven_score: 2.6,
    debt_score: 2.9,
    ownership_score: 2.2,
    conduct_score: 3.1,
    persistence_multiplier: 0.85,
    methods: [],
    revenue: 650000,
  },
];

const bookmarkData = [
  {
    name: "Critical Risk Companies - Q1 Review",
    description:
      "High-priority companies requiring immediate tax compliance review",
    companyIds: [1, 6], // TechCorp Industries, Financial Services Corp
    status: "Active",
    notes: "Focus on transfer pricing and shell layering arrangements",
  },
  {
    name: "High Risk Manufacturing Sector",
    description: "Manufacturing companies with elevated risk profiles",
    companyIds: [2, 4], // Global Manufacturing Ltd, Energy Solutions Group
    status: "Active",
    notes: "Review debt shifting and transfer pricing methodologies",
  },
  {
    name: "Medium Risk Companies - Routine Check",
    description: "Companies requiring standard compliance monitoring",
    companyIds: [3, 8, 9], // Retail Solutions Inc, Logistics Network Inc, Media Group International
    status: "Active",
    notes: "Quarterly review of transfer pricing documentation",
  },
  {
    name: "Healthcare Sector Deep Dive",
    description: "Pharmaceutical companies with royalty stripping concerns",
    companyIds: [5], // Pharmaceutical Innovations
    status: "Archived",
    notes: "IP valuation and royalty arrangements reviewed and approved",
  },
  {
    name: "Low Risk Companies - Annual Audit",
    description: "Low-risk companies for annual compliance verification",
    companyIds: [7, 10], // Construction Holdings, Agriculture Tech Ltd
    status: "Active",
    notes: "Basic compliance check, low priority",
  },
];

async function main() {
  console.log("🔖 Starting Bookmark seeder...");

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
  await prisma.bookmark.deleteMany();
  await prisma.companyCollection.deleteMany();
  console.log("🗑️  Cleared existing Bookmark and CompanyCollection data");

  // Insert companies first
  console.log("🏢 Seeding companies...");
  const createdCompanies: any[] = [];
  for (const company of companyCollectionData) {
    const created = await prisma.companyCollection.create({
      data: {
        ...company,
        methods: toPrismaCompanyMethods(company.methods),
        userId: seedUser.id,
      },
    });
    createdCompanies.push(created);
  }
  console.log(
    `✅ Successfully seeded ${createdCompanies.length} CompanyCollection records`,
  );

  // Insert bookmarks with company relationships
  console.log("📑 Seeding bookmarks...");
  const bookmarkConfigs = [
    {
      name: "Critical Risk Companies - Q1 Review",
      description:
        "High-priority companies requiring immediate tax compliance review",
      companyIndices: [0, 5], // TechCorp Industries (index 0), Financial Services Corp (index 5)
      status: "Active",
      notes: "Focus on transfer pricing and shell layering arrangements",
    },
    {
      name: "High Risk Manufacturing Sector",
      description: "Manufacturing companies with elevated risk profiles",
      companyIndices: [1, 3], // Global Manufacturing Ltd (index 1), Energy Solutions Group (index 3)
      status: "Active",
      notes: "Review debt shifting and transfer pricing methodologies",
    },
    {
      name: "Medium Risk Companies - Routine Check",
      description: "Companies requiring standard compliance monitoring",
      companyIndices: [2, 7, 8], // Retail Solutions Inc (index 2), Logistics Network Inc (index 7), Media Group International (index 8)
      status: "Active",
      notes: "Quarterly review of transfer pricing documentation",
    },
    {
      name: "Healthcare Sector Deep Dive",
      description: "Pharmaceutical companies with royalty stripping concerns",
      companyIndices: [4], // Pharmaceutical Innovations (index 4)
      status: "Archived",
      notes: "IP valuation and royalty arrangements reviewed and approved",
    },
    {
      name: "Low Risk Companies - Annual Audit",
      description: "Low-risk companies for annual compliance verification",
      companyIndices: [6, 9], // Construction Holdings (index 6), Agriculture Tech Ltd (index 9)
      status: "Active",
      notes: "Basic compliance check, low priority",
    },
  ];

  for (const config of bookmarkConfigs) {
    const companyIds = config.companyIndices.map(
      (index) => createdCompanies[index].id,
    );
    await prisma.bookmark.create({
      data: {
        userId: seedUser.id,
        name: config.name,
        description: config.description,
        status: config.status as BookmarkStatusType,
        notes: config.notes,
        companies: {
          create: companyIds.map((companyId) => ({
            company: { connect: { id: companyId } },
          })),
        },
      },
    });
  }

  console.log(`✅ Successfully seeded ${bookmarkData.length} Bookmark records`);
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
