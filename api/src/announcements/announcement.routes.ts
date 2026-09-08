import { Hono } from "hono";
import type { AnnouncementService } from "./announcement.service.js";

export function createAnnouncementRoutes(
	announcementService: AnnouncementService,
) {
	const app = new Hono();

	app.get("/", async (c) => {
		const announcements = await announcementService.listAnnouncements();

		return c.json(announcements);
	});

	app.get("/:id", async (c) => {
		const announcement = await announcementService.findById(c.req.param("id"));
		if (!announcement) {
			return c.json({ error: "Announcement not found" }, 404);
		}

		return c.json(announcement);
	});

	return app;
}
