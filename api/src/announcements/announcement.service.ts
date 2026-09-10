import type { AnnouncementRepository } from "./announcement.repository.js";
import type { EditAnnouncementInput } from "./announcement.schema.js";

export class AnnouncementService {
	constructor(private announcements: AnnouncementRepository) {}

	async list(limit: number) {
		return this.announcements.list(limit);
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
