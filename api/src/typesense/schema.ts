import type { CollectionCreateSchema } from "typesense";

export type SearchedAnnouncement = {
	id: string;
	title: string;
	content: string;
	published_at: number;
	updated_at: number;
	category_ids: string[];
	categories: string;
};

export const announcementsSchema = {
	name: "announcements",

	fields: [
		{
			name: "id",
			type: "string",
		},
		{
			name: "title",
			type: "string",
		},
		{
			name: "content",
			type: "string",
		},
		{
			name: "published_at",
			type: "int64",
		},
		{
			name: "updated_at",
			type: "int64",
		},
		{
			name: "category_ids",
			type: "string[]",
			facet: true,
		},
		{
			name: "categories",
			type: "string",
			index: false,
		},
	],
	default_sorting_field: "updated_at",
} satisfies CollectionCreateSchema;
