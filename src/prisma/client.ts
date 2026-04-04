import { PrismaClient } from "../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma v7 requires an adapter in the PrismaClient options
const prismaAdapter = new PrismaPg({
  connectionString:
    process.env.DATABASE_URL ||
    `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
});

const prisma = new PrismaClient({
  adapter: prismaAdapter,
});

export default prisma;
