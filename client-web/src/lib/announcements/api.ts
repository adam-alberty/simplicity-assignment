import { apiFetch } from "../api/client";
import type { Announcement } from "./types";

interface ListAnnouncementsResponse {
	announcements: {
		id: string;
		title: string;
		content: string;
		publishedAt: string;
		updatedAt: string;
		categories: {
			id: string;
			name: string;
		}[];
	}[];
}

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

interface GetOneAnnouncementResponse {
	id: string;
	title: string;
	content: string;
	publishedAt: string;
	updatedAt: string;
	categories: {
		id: string;
		name: string;
	}[];
}

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
