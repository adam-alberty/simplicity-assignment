import type { Client as TypesenseClient } from "typesense";
import {
	announcementsSchema,
	type SearchedAnnouncement,
} from "@/typesense/schema.js";
import type { Announcement } from "../model.js";

export class AnnouncementSearchRepository {
	constructor(private typesense: TypesenseClient) {}

	async upsert(announcement: Announcement) {
		return this.typesense
			.collections(announcementsSchema.name)
			.documents()
			.upsert({
				id: announcement.id,
				title: announcement.title,
				content: announcement.content,
				published_at: announcement.publishedAt.getTime(),
				updated_at: announcement.updatedAt.getTime(),
				category_ids: announcement.categories.map((category) => category.id),
				categories: JSON.stringify(announcement.categories),
			} satisfies SearchedAnnouncement);
	}

	async search(input: {
		query: string;
		categories?: string[];
		limit: number;
	}): Promise<{ announcements: Announcement[] }> {
		const result = await this.typesense
			.collections(announcementsSchema.name)
			.documents()
			.search({
				q: input.query,
				query_by: "title,content",
				query_by_weights: "3,1",
				per_page: input.limit,
				filter_by: input.categories?.length
					? `category_ids:=[${input.categories.join(",")}]`
					: undefined,
			});

		if (!result.hits) {
			return { announcements: [] };
		}

		const announcements = result.hits.map((hit) => {
			const announcement = hit.document as SearchedAnnouncement;

			return {
				id: announcement.id,
				title: announcement.title,
				content: announcement.content,
				publishedAt: new Date(announcement.published_at),
				updatedAt: new Date(announcement.updated_at),
				categories: JSON.parse(announcement.categories),
			};
		});

		return { announcements };
	}

	async delete(id: string) {
		return this.typesense
			.collections(announcementsSchema.name)
			.documents(id)
			.delete();
	}
}
