import type { AnnouncementCategoryRepository } from "./repository.js";

export class AnnouncementCategoryService {
	constructor(private categories: AnnouncementCategoryRepository) {}

	async listCategories() {
		return this.categories.list();
	}
}
