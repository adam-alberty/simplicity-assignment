import type { AnnouncementCategory } from "./categories/model.js";

export type Announcement = {
	id: string;
	title: string;
	content: string;
	publishedAt: Date;
	updatedAt: Date;
	categories: AnnouncementCategory[];
};
