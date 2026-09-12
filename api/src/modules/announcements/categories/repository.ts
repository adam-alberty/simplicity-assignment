import type { Database } from "@/db/index.js";
import { categoriesTable } from "@/db/schema.js";
import type { AnnouncementCategory } from "./model.js";

export class AnnouncementCategoryRepository {
	constructor(private db: Database) {}

	async create(category: Omit<AnnouncementCategory, "id">) {
		const [cat] = await this.db
			.insert(categoriesTable)
			.values(category)
			.returning();
		return cat;
	}

	async list(): Promise<AnnouncementCategory[]> {
		const categories = await this.db.query.announcementCategories.findMany({
			orderBy: (t, { asc }) => asc(t.name),
		});

		return categories;
	}
}
