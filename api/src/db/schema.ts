import { defineRelations } from "drizzle-orm";
import {
	index,
	primaryKey,
	snakeCase,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const announcementsTable = snakeCase.table(
	"announcements",
	{
		id: uuid().defaultRandom().primaryKey(),
		title: varchar({ length: 255 }).notNull(),
		content: text().notNull(),
		publishedAt: timestamp().notNull().defaultNow(),
		updatedAt: timestamp().notNull().defaultNow(),
	},
	(t) => [index("updated_at_id_idx").on(t.updatedAt, t.id)],
);

export const categoriesTable = snakeCase.table("categories", {
	id: uuid().defaultRandom().primaryKey(),
	name: varchar({ length: 255 }).notNull(),
});

export const announcementsToCategoriesTable = snakeCase.table(
	"announcement_categories",
	{
		announcementId: uuid("announcement_id")
			.notNull()
			.references(() => announcementsTable.id, {
				onDelete: "cascade",
			}),
		categoryId: uuid("category_id")
			.notNull()
			.references(() => categoriesTable.id, {
				onDelete: "cascade",
			}),
	},
	(t) => [primaryKey({ columns: [t.announcementId, t.categoryId] })],
);

export const relations = defineRelations(
	{
		announcements: announcementsTable,
		announcementCategories: categoriesTable,
		announcementsToCategories: announcementsToCategoriesTable,
	},
	(r) => ({
		announcements: {
			categories: r.many.announcementCategories({
				from: r.announcements.id.through(
					r.announcementsToCategories.announcementId,
				),
				to: r.announcementCategories.id.through(
					r.announcementsToCategories.categoryId,
				),
			}),
		},
		categories: {
			announcements: r.many.announcements(),
		},
	}),
);
