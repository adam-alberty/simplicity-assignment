import type { AnnouncementRepository } from "./announcement.repository.js";
import type { EditAnnouncementInput } from "./announcement.schema.js";

export class AnnouncementService {
	constructor(private announcements: AnnouncementRepository) {}

	async listAnnouncements() {
		return this.announcements.list();
	}

	async findById(id: string) {
		return this.announcements.findById(id);
	}

	async edit(id: string, announcement: EditAnnouncementInput) {
		return this.announcements.editById(id, announcement);
	}
}
