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
