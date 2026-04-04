import { execSync } from "child_process";
import dotenv from "dotenv";

export async function runMigrations(): Promise<void> {
  console.log("ℹ️  Migrations handled at container startup");
}
