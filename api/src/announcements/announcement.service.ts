import type { AnnouncementRepository } from "./announcement.repository.js";

export class AnnouncementService {
	constructor(private announcements: AnnouncementRepository) {}

	async listAnnouncements() {
		return this.announcements.list();
	}

	async findById(id: string) {
		return this.announcements.findById(id);
	}
}
