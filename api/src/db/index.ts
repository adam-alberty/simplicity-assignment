import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { relations } from "./schema.js";

export type Database = Awaited<ReturnType<typeof initializeDatabase>>;

export async function initializeDatabase() {
	if (!process.env.DATABASE_URL) {
		throw new Error("`DATABASE_URL` environment variable must be set");
	}

	const pool = new Pool({
		connectionString: process.env.DATABASE_URL,
	});

	const db = drizzle({ client: pool, relations });

	try {
		await db.execute("SELECT 1");
		console.log("✅ Database connected");
	} catch (error) {
		console.error("❌ Database connection failed:", error);
		process.exit(1);
	}

	return db;
}
