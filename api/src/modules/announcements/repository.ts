import { eq } from "drizzle-orm";
import type { Database } from "@/db/index.js";
import {
	announcementsTable,
	announcementsToCategoriesTable,
} from "@/db/schema.js";
import { AppError } from "@/errors/error.js";
import type { Announcement } from "./model.js";
import type { CreateAnnouncementInput } from "./schema.js";
import {
	decodeAnnouncementCursor,
	encodeAnnouncementCursor,
} from "./cursor.js";

export class AnnouncementRepository {
	constructor(private db: Database) {}

	async create(announcement: CreateAnnouncementInput): Promise<Announcement> {
		return await this.db.transaction(async (tx) => {
			const [newAnnouncement] = await tx
				.insert(announcementsTable)
				.values({
					title: announcement.title,
					content: announcement.content,
					publishedAt: announcement.publishedAt,
					updatedAt: announcement.updatedAt,
				})
				.returning();

			await tx.insert(announcementsToCategoriesTable).values(
				announcement.categoryIds.map((categoryId) => ({
					announcementId: newAnnouncement.id,
					categoryId,
				})),
			);

			const createdAnnouncement = await tx.query.announcements.findFirst({
				where: {
					id: newAnnouncement.id,
				},
				with: {
					categories: true,
				},
			});

			if (!createdAnnouncement) {
				throw new Error("announcement not found");
			}

			return createdAnnouncement;
		});
	}

	async update(id: string, announcement: CreateAnnouncementInput) {
		return await this.db.transaction(async (tx) => {
			const [updatedAnnouncement] = await tx
				.update(announcementsTable)
				.set({
					title: announcement.title,
					content: announcement.content,
					publishedAt: announcement.publishedAt,
					updatedAt: new Date(),
				})
				.where(eq(announcementsTable.id, id))
				.returning();

			if (!updatedAnnouncement) {
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

			const ann = await tx.query.announcements.findFirst({
				where: {
					id: updatedAnnouncement.id,
				},
				with: {
					categories: true,
				},
			});

			if (!ann) {
				throw new Error("announcement not found");
			}

			return ann;
		});
	}

	async delete(id: string) {
		await this.db
			.delete(announcementsTable)
			.where(eq(announcementsTable.id, id));
	}

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

	async list(input: { limit: number; categories?: string[]; cursor?: string }) {
		const decodedCursor = input.cursor
			? decodeAnnouncementCursor(input.cursor)
			: undefined;

		const announcements = await this.db.query.announcements.findMany({
			where: {
				AND: [
					input.categories
						? {
								categories: {
									id: {
										in: input.categories,
									},
								},
							}
						: {},

					decodedCursor
						? {
								OR: [
									{
										updatedAt: {
											lt: decodedCursor.updatedAt,
										},
									},
									{
										updatedAt: {
											eq: decodedCursor.updatedAt,
										},
										id: {
											lt: decodedCursor.id,
										},
									},
								],
							}
						: {},
				],
			},
			orderBy: {
				updatedAt: "desc",
				id: "desc",
			},
			limit: input.limit + 1,
			with: {
				categories: {
					orderBy: {
						name: "asc",
					},
				},
			},
		});

		const prevAnnouncements = decodedCursor
			? await this.db.query.announcements.findMany({
					where: {
						AND: [
							input.categories
								? {
										categories: {
											id: {
												in: input.categories,
											},
										},
									}
								: {},

							decodedCursor
								? {
										OR: [
											{
												updatedAt: {
													gt: decodedCursor.updatedAt,
												},
											},
											{
												updatedAt: {
													eq: decodedCursor.updatedAt,
												},
												id: {
													gt: decodedCursor.id,
												},
											},
										],
									}
								: {},
						],
					},
					orderBy: {
						updatedAt: "asc",
						id: "asc",
					},
					limit: input.limit + 1,
				})
			: [];

		const hasMore = announcements.length > input.limit;
		const data = announcements.slice(0, input.limit);
		const last = data.at(-1);

		const hasPrevious = prevAnnouncements.length > 0;
		const prevData = prevAnnouncements.slice(0, input.limit);
		const prev = prevData.at(-1);

		return {
			announcements: data,
			nextCursor:
				hasMore && last
					? encodeAnnouncementCursor({ id: last.id, updatedAt: last.updatedAt })
					: null,
			prevCursor:
				hasPrevious && prev
					? encodeAnnouncementCursor({ id: prev.id, updatedAt: prev.updatedAt })
					: null,
		};
	}
}
