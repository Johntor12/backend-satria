import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function runMigrations(): Promise<void> {
  try {
    if (!process.env.DATABASE_URL) {
      console.warn("⚠️  DATABASE_URL not set, skipping migrations");
      return;
    }

    console.log("🔄 Running database migrations...");
    await execAsync("npx prisma migrate deploy", {
      env: { ...process.env },
    });
    console.log("✅ Migrations completed successfully");
  } catch (error) {
    console.warn(
      "⚠️  Migration warning (may already be up-to-date):",
      error instanceof Error ? error.message : error
    );
    // Don't fail the app if migrations have already been applied
  }
}
