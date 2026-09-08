export type AnnouncementCategory = {
	id: string;
	name: string;
};

export type Announcement = {
	id: string;
	title: string;
	content: string;
	publishedAt: Date;
	updatedAt: Date;
	categories: AnnouncementCategory[];
};
