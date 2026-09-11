import type { AnnouncementRepository } from "./repository.js";
import type { EditAnnouncementInput } from "./schema.js";

export class AnnouncementService {
	constructor(private announcements: AnnouncementRepository) {}

	async list(
		limit: number,
		filter: {
			query?: string;
			categories?: string[];
		},
		cursor?: Date,
	) {
		return this.announcements.list(limit, filter, cursor);
	}

	async findById(id: string) {
		return this.announcements.findById(id);
	}

	async update(id: string, announcement: EditAnnouncementInput) {
		return this.announcements.update(id, announcement);
	}

	async delete(id: string) {
		return this.announcements.delete(id);
	}
}
