import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { relations } from "./schema.js";

if (!process.env.DATABASE_URL) {
	throw new Error("`DATABASE_URL` environment variable must be set");
}

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

export const db = drizzle({ client: pool, relations });

export type Database = typeof db;

export async function mustConnectToDatabase() {
	try {
		await db.execute("SELECT 1");
		console.log("✅ Database connected:");
	} catch (error) {
		console.error("❌ Database connection failed:", error);
		process.exit(1);
	}
}
