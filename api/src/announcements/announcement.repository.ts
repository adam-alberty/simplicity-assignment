import type { Database } from "../db/index.js";
import type { Announcement } from "./announcement.model.js";

export class AnnouncementRepository {
	constructor(private db: Database) {}

	async findById(id: string): Promise<Announcement | null> {
		const announcement = await this.db.query.announcements.findFirst({
			where: {
				id,
			},

			with: {
				categories: true,
			},
		});

		if (!announcement) {
			return null;
		}

		return {
			id: announcement.id,
			title: announcement.title,
			publishedAt: announcement.publishedAt,
			content: announcement.content,
			updatedAt: announcement.updatedAt,
			categories: announcement.categories,
		};
	}

	async list(): Promise<Announcement[]> {
		const announcements = await this.db.query.announcements.findMany({
			with: {
				categories: true,
			},
			orderBy: (t, { desc }) => desc(t.updatedAt),
		});

		return announcements;
	}
}
