import { apiFetch } from "../api/client";
import type { Announcement, AnnouncementCategory } from "./types";

type ListAnnouncementsResponse = {
	announcements: Announcement[];
	nextCursor: string;
	prevCursor: string;
};

export async function listAnnouncements(
	filter: {
		categories?: string[];
		query?: string;
	},
	cursor?: string,
	limit = 100,
): Promise<ListAnnouncementsResponse> {
	const params = new URLSearchParams();

	if (filter.query) {
		params.set("query", filter.query);
	}

	params.set("limit", limit.toString());

	if (cursor) {
		params.set("cursor", cursor);
	}

	if (filter.categories) {
		filter.categories.forEach((category) => {
			params.append("category", category);
		});
	}

	const res = await apiFetch<ListAnnouncementsResponse>(
		`/announcements?${params.toString()}`,
	);

	return {
		announcements: res.announcements.map((announcement) => ({
			id: announcement.id,
			title: announcement.title,
			content: announcement.content,
			categories: announcement.categories,
			publishedAt: new Date(announcement.publishedAt),
			updatedAt: new Date(announcement.updatedAt),
		})),
		nextCursor: res.nextCursor,
		prevCursor: res.prevCursor,
	};
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
): Promise<void> {
	const reqBody = {
		title: announcement.title,
		content: announcement.content,
		publishedAt: announcement.publishedAt,
		categoryIds: announcement.categoryIds,
	};

	return await apiFetch<void>(`/announcements/${announcement.id}`, {
		method: "PATCH",
		body: JSON.stringify(reqBody),
	});
}

export type CreateAnnouncementInput = {
	title: string;
	content: string;
	publishedAt: Date;
	categoryIds: string[];
};

export async function createAnnouncement(
	announcement: CreateAnnouncementInput,
): Promise<void> {
	const reqBody = {
		title: announcement.title,
		content: announcement.content,
		publishedAt: announcement.publishedAt,
		categoryIds: announcement.categoryIds,
	};

	return await apiFetch<void>(`/announcements`, {
		method: "POST",
		body: JSON.stringify(reqBody),
	});
}

export async function deleteAnnouncement(id: string) {
	return await apiFetch(`/announcements/${id}`, { method: "DELETE" });
}
