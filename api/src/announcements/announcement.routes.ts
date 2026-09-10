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
		const validated = z
			.object({
				queryParamLimit: z.coerce.number().min(1).max(100),
				queryParamCursor: z.coerce.date().optional(),
				queryParamCategories: z.array(z.uuid()).optional(),
			})
			.parse({
				queryParamLimit: c.req.query("limit") ?? 100,
				queryParamCursor: c.req.query("cursor"),
				queryParamCategories: c.req.queries("category"),
			});

		const announcements = await announcementService.list(
			validated.queryParamLimit,
			{
				categories: validated.queryParamCategories,
			},
			validated.queryParamCursor,
		);

		return c.json(announcements);
	});

	app.get("/:id", async (c) => {
		const validated = z
			.object({
				announcementId: z.uuid(),
			})
			.parse({ announcementId: c.req.param("id") });

		const announcement = await announcementService.findById(
			validated.announcementId,
		);
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
		const validated = z
			.object({
				announcementId: z.uuid(),
			})
			.parse({ announcementId: c.req.param("id") });

		const parsedBody = z.parse(editAnnouncementSchema, await c.req.json());

		await announcementService.update(validated.announcementId, parsedBody);

		return c.json({ success: true });
	});

	app.delete("/:id", async (c) => {
		const validated = z
			.object({
				announcementId: z.uuid(),
			})
			.parse({ announcementId: c.req.param("id") });

		await announcementService.delete(validated.announcementId);

		return c.json({ success: true });
	});

	return app;
}
