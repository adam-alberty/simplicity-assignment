import "dotenv/config";
import { Client } from "typesense";
import { announcementsSchema } from "./schema.js";

export type SearchClient = Awaited<ReturnType<typeof initializeSearch>>;

export async function initializeSearch() {
	if (!process.env.TYPESENSE_URL) {
		throw new Error("`TYPESENSE_URL` environment variable must be set");
	}

	if (!process.env.TYPESENSE_API_KEY) {
		throw new Error("`TYPESENSE_API_KEY` environment variable must be set");
	}

	const client = new Client({
		nodes: [{ url: process.env.TYPESENSE_URL }],
		apiKey: process.env.TYPESENSE_API_KEY,
		connectionTimeoutSeconds: 5,
	});

	try {
		await client.collections(announcementsSchema.name).retrieve();
		console.log("✅ Typesense schema exists");
	} catch {
		console.log("Typesense schema does not exist, creating");
		await client.collections().create(announcementsSchema);
		console.log("✅ Typesense schema created successfully");
	}

	return client;
}
