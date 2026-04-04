import { execSync } from "child_process";
import dotenv from "dotenv";

export async function runMigrations(): Promise<void> {
  try {
    // Ensure environment variables are loaded
    dotenv.config();

    if (!process.env.DATABASE_URL) {
      console.warn("⚠️  DATABASE_URL not set, skipping migrations");
      return;
    }

    console.log("🔄 Running database migrations...");
    console.log(
      `Database: ${process.env.DATABASE_URL.split("@")[1]?.split("?")[0] || "unknown"}`
    );

    // Run migrations with explicit environment variables
    execSync("npx prisma migrate deploy", {
      stdio: "inherit",
      env: { ...process.env },
    });

    console.log("✅ Migrations completed successfully");
  } catch (error) {
    // Don't fail the app if migrations have already been applied
    console.warn(
      "⚠️  Migration warning:",
      error instanceof Error ? error.message : String(error)
    );
  }
}
