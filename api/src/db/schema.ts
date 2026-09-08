import { defineRelations } from "drizzle-orm";
import {
	primaryKey,
	text,
	timestamp,
	uuid,
	varchar,
	snakeCase,
} from "drizzle-orm/pg-core";

export const announcementsTable = snakeCase.table("announcements", {
	id: uuid().defaultRandom().primaryKey(),
	title: varchar({ length: 255 }).notNull(),
	content: text().notNull(),
	publishedAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp().notNull().defaultNow(),
});

export const categoriesTable = snakeCase.table("categories", {
	id: uuid().defaultRandom().primaryKey(),
	name: varchar({ length: 255 }).notNull(),
});

export const announcementsToCategoriesTable = snakeCase.table(
	"announcements_to_categories",
	{
		announcementId: uuid("announcement_id")
			.notNull()
			.references(() => announcementsTable.id),
		categoryId: uuid("category_id")
			.notNull()
			.references(() => categoriesTable.id),
	},
	(t) => [primaryKey({ columns: [t.announcementId, t.categoryId] })],
);

export const relations = defineRelations(
	{
		announcements: announcementsTable,
		categories: categoriesTable,
		announcementsToCategories: announcementsToCategoriesTable,
	},
	(r) => ({
		announcements: {
			categories: r.many.categories({
				from: r.announcements.id.through(
					r.announcementsToCategories.announcementId,
				),
				to: r.categories.id.through(r.announcementsToCategories.categoryId),
			}),
		},
		categires: {
			announcements: r.many.announcements(),
		},
	}),
);
