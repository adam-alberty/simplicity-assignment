import type { AnnouncementRepository } from "./repository.js";
import type { CreateAnnouncementInput } from "./schema.js";
import type { AnnouncementSearchRepository } from "./search/repository.js";

export class AnnouncementService {
	constructor(
		private announcements: AnnouncementRepository,
		private search: AnnouncementSearchRepository,
		private broadcast: (message: unknown) => void,
	) {}

	async create(announcement: CreateAnnouncementInput) {
		const newAnnouncement = await this.announcements.create(announcement);
		await this.search.upsert(newAnnouncement);
		this.broadcast({
			type: "announcement.created",
			data: `${announcement.title}`,
		});
	}

	async list(input: {
		limit: number;
		query?: string;
		categories?: string[];
		cursor?: string;
	}) {
		if (input.query) {
			return this.search.search({
				limit: input.limit,
				query: input.query,
				categories: input.categories,
			});
		}

		return this.announcements.list({
			limit: input.limit,
			categories: input.categories,
			cursor: input.cursor,
		});
	}

	async findById(id: string) {
		return this.announcements.findById(id);
	}

	async update(id: string, announcement: CreateAnnouncementInput) {
		const updatedAnnouncement = await this.announcements.update(
			id,
			announcement,
		);
		await this.search.upsert(updatedAnnouncement);
	}

	async delete(id: string) {
		await this.announcements.delete(id);
		await this.search.delete(id);
	}
}
