import "dotenv/config";
import { faker } from "@faker-js/faker";
import type { Client as TypesenseClient } from "typesense";
import { AnnouncementCategoryRepository } from "@/modules/announcements/categories/repository.js";
import { AnnouncementCategoryService } from "@/modules/announcements/categories/service.js";
import { AnnouncementRepository } from "@/modules/announcements/repository.js";
import { AnnouncementSearchRepository } from "@/modules/announcements/search/repository.js";
import { AnnouncementService } from "@/modules/announcements/service.js";
import type { Database } from "./index.js";

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

export async function seedDatabase(db: Database, search: TypesenseClient) {
	const categoryService = new AnnouncementCategoryService(
		new AnnouncementCategoryRepository(db),
	);
	const announcementService = new AnnouncementService(
		new AnnouncementRepository(db),
		new AnnouncementSearchRepository(search),
		(_) => {},
	);

	const categories = await categoryService.list();
	if (categories.length) {
		console.log("Database already seeded, skipping seeding.");
		return;
	}

	const createdCategories = await Promise.all(
		announcementCategories.map((category) =>
			categoryService.create({ name: category }),
		),
	);

	const announcements = Array.from({ length: 1000 }, () => {
		const nowDate = new Date();
		const publishedAt = faker.date.between({
			from: "2000-01-01",
			to: nowDate.setDate(nowDate.getDate() - 7),
		});

		const updatedAt = new Date(publishedAt);
		updatedAt.setDate(updatedAt.getDate() + 7);

		const categoryIds = faker.helpers
			.arrayElements(createdCategories, { min: 1, max: 5 })
			.map((cat) => cat.id);

		return {
			title: faker.lorem.words(5),
			content: faker.lorem.paragraphs(2),
			publishedAt,
			updatedAt,
			categoryIds,
		};
	});

	await Promise.all(
		announcements.map((announcement) =>
			announcementService.create(announcement),
		),
	);

	console.log("✅ Seed complete");
}
