import { Hono } from "hono";
import type { AnnouncementService } from "./announcement.service.js";
import { AppError } from "../errors/error.js";

export function createAnnouncementRoutes(
	announcementService: AnnouncementService,
) {
	const app = new Hono();

	app.get("/", async (c) => {
		const announcements = await announcementService.listAnnouncements();

		return c.json({
			announcements,
		});
	});

	app.get("/:id", async (c) => {
		const announcement = await announcementService.findById(c.req.param("id"));
		if (!announcement) {
			throw new AppError(
				"Announcement not found",
				"Announcement with specified ID could not be found",
				404,
			);
		}

		return c.json(announcement);
	});

	return app;
}
