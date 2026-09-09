import "dotenv/config";
import { faker } from "@faker-js/faker";
import { db } from "./index.js";
import {
	announcementsTable,
	announcementsToCategoriesTable,
	categoriesTable,
} from "./schema.js";

export async function seedDatabase() {
	const existingCategories = await db.select().from(categoriesTable).limit(1);
	if (existingCategories.length) {
		console.log("Database already seeded, skipping seeding.");
		return;
	}

	const announcementCategories = [
		"Community Events",
		"Crime & Safety",
		"Culture",
		"Discounts & Benefits",
		"Emergencies",
		"For Seniors",
		"Health",
		"Kids & Family",
		"Local News",
		"Public Services",
		"Roads & Transportation",
		"Schools & Education",
		"Sports & Recreation",
		"Environment",
		"Jobs & Employment",
		"Housing",
		"Business",
		"Utilities",
		"Weather",
		"Other",
	];

	const createdCategories = await db
		.insert(categoriesTable)
		.values(announcementCategories.map((cat) => ({ name: cat })))
		.returning();

	const announcements = Array.from({ length: 1000 }, () => {
		const nowDate = new Date();
		const publishedAt = faker.date.between({
			from: "2000-01-01",
			to: nowDate.setDate(nowDate.getDate() - 7),
		});

		const updatedAt = new Date(publishedAt);
		updatedAt.setDate(updatedAt.getDate() + 7);

		return {
			title: faker.lorem.words(5),
			content: faker.lorem.paragraphs(2),
			publishedAt,
			updatedAt,
		};
	});

	const createdAnnouncements = await db
		.insert(announcementsTable)
		.values(announcements)
		.returning();

	for (const announcement of createdAnnouncements) {
		const announcementCategories = faker.helpers
			.arrayElements(createdCategories, { min: 1, max: 5 })
			.map((cat) => ({
				categoryId: cat.id,
				announcementId: announcement.id,
			}));

		await db
			.insert(announcementsToCategoriesTable)
			.values(announcementCategories)
			.returning();
	}

	console.log("✅ Seed complete");
}
