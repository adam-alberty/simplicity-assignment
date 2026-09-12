import type { AnnouncementCategory } from "./model.js";
import type { AnnouncementCategoryRepository } from "./repository.js";

export class AnnouncementCategoryService {
	constructor(private categories: AnnouncementCategoryRepository) {}

	async create(category: Omit<AnnouncementCategory, "id">) {
		return this.categories.create(category);
	}

	async list() {
		return this.categories.list();
	}
}
