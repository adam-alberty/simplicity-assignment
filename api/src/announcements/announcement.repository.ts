import { eq } from "drizzle-orm";
import type { Database } from "../db/index.js";
import {
	announcementsTable,
	announcementsToCategoriesTable,
} from "../db/schema.js";
import { AppError } from "../errors/error.js";
import type { Announcement } from "./announcement.model.js";
import type { EditAnnouncementInput } from "./announcement.schema.js";

export class AnnouncementRepository {
	constructor(private db: Database) {}

	async findById(id: string): Promise<Announcement | null> {
		const announcement = await this.db.query.announcements.findFirst({
			where: {
				id,
			},
			with: {
				categories: {
					orderBy: (categories, { asc }) => asc(categories.name),
				},
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

	async list(limit: number, cursorUpdatedAt?: Date) {
		const announcements = await this.db.query.announcements.findMany({
			with: {
				categories: {
					orderBy: (categories, { asc }) => asc(categories.name),
				},
			},

			where: cursorUpdatedAt
				? {
						updatedAt: {
							lt: cursorUpdatedAt,
						},
					}
				: undefined,

			orderBy: (t, { desc }) => desc(t.updatedAt),
			limit: limit + 1,
		});

		const hasMore = announcements.length > limit;
		const data = announcements.slice(0, limit);

		const last = data.at(-1);

		return {
			announcements: data,
			nextCursor:
				hasMore && last
					? {
							updatedAt: last.updatedAt,
						}
					: null,
		};
	}

	async update(id: string, announcement: EditAnnouncementInput) {
		await this.db.transaction(async (tx) => {
			const [editedAnnouncement] = await tx
				.update(announcementsTable)
				.set({
					title: announcement.title,
					content: announcement.content,
					publishedAt: announcement.publishedAt,
					updatedAt: new Date(),
				})
				.where(eq(announcementsTable.id, id))
				.returning();

			if (!editedAnnouncement) {
				throw new AppError(
					"Announcement not found",
					"Announcement with specified ID could not be found.",
					404,
				);
			}

			await tx
				.delete(announcementsToCategoriesTable)
				.where(eq(announcementsToCategoriesTable.announcementId, id));

			await tx.insert(announcementsToCategoriesTable).values(
				announcement.categoryIds.map((categoryId) => ({
					announcementId: id,
					categoryId,
				})),
			);
		});
	}

	async delete(id: string) {
		await this.db
			.delete(announcementsTable)
			.where(eq(announcementsTable.id, id));
	}
}
