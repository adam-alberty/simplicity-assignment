import { apiFetch } from "../api/client";
import type { Announcement, AnnouncementCategory } from "./types";

type ListAnnouncementsResponse = {
	announcements: Announcement[];
};

export async function listAnnouncements(): Promise<Announcement[]> {
	const res = await apiFetch<ListAnnouncementsResponse>("/announcements");

	return res.announcements.map((announcement) => ({
		id: announcement.id,
		title: announcement.title,
		content: announcement.content,
		categories: announcement.categories,
		publishedAt: new Date(announcement.publishedAt),
		updatedAt: new Date(announcement.updatedAt),
	}));
}

type GetOneAnnouncementResponse = Announcement;

export async function getOneAnnouncement(id: string): Promise<Announcement> {
	const res = await apiFetch<GetOneAnnouncementResponse>(
		`/announcements/${id}`,
	);

	return {
		id: res.id,
		title: res.title,
		content: res.content,
		categories: res.categories,
		publishedAt: new Date(res.publishedAt),
		updatedAt: new Date(res.updatedAt),
	};
}

type GetAnnouncementCategoriesResponse = AnnouncementCategory[];

export async function getAnnouncementCategories(): Promise<
	AnnouncementCategory[]
> {
	const res = await apiFetch<GetAnnouncementCategoriesResponse>(
		`/announcement-categories`,
	);

	return res.map((cat) => ({
		id: cat.id,
		name: cat.name,
	}));
}

export type EditAnnouncementInput = {
	id: string;
	title: string;
	content: string;
	publishedAt: Date;
	categoryIds: string[];
};

export async function editAnnouncement(
	announcement: EditAnnouncementInput,
): Promise<AnnouncementCategory[]> {
	const reqBody = {
		title: announcement.title,
		content: announcement.content,
		publishedAt: announcement.publishedAt,
		categoryIds: announcement.categoryIds,
	};

	return await apiFetch<GetAnnouncementCategoriesResponse>(
		`/announcements/${announcement.id}`,
		{ method: "PATCH", body: JSON.stringify(reqBody) },
	);
}
