import type { Database } from "../../db/index.js";
import type { AnnouncementCategory } from "./category.model.js";

export class AnnouncementCategoryRepository {
	constructor(private db: Database) {}

	async list(): Promise<AnnouncementCategory[]> {
		const categories = await this.db.query.announcementCategories.findMany({
			orderBy: (t, { asc }) => asc(t.name),
		});

		return categories;
	}
}
