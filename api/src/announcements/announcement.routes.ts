import { Hono } from "hono";
import z from "zod";
import { AppError } from "../errors/error.js";
import { editAnnouncementSchema } from "./announcement.schema.js";
import type { AnnouncementService } from "./announcement.service.js";

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

	app.patch("/:id", async (c) => {
		const parsedBody = z.parse(editAnnouncementSchema, await c.req.json());

		await announcementService.edit(c.req.param("id"), parsedBody);

		return c.json({ success: true });
	});

	return app;
}
