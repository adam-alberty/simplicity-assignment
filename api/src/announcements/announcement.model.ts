import type { AnnouncementCategory } from "./categories/category.model.js";

export type Announcement = {
	id: string;
	title: string;
	content: string;
	publishedAt: Date;
	updatedAt: Date;
	categories: AnnouncementCategory[];
};
