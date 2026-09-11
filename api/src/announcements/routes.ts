import { Hono } from "hono";
import z from "zod";
import { AppError } from "../errors/error.js";
import { editAnnouncementSchema } from "./schema.js";
import type { AnnouncementService } from "./service.js";

export function createAnnouncementRoutes(
	announcementService: AnnouncementService,
) {
	const app = new Hono();

	// Lists announcements.
	app.get("/", async (c) => {
		const validated = z
			.object({
				queryParamLimit: z.coerce.number().min(1).max(100),
				queryParamCursor: z.coerce.date().optional(),
				queryParamCategories: z.array(z.uuid()).optional(),
				queryParamSearchQuery: z.string().optional(),
			})
			.parse({
				queryParamLimit: c.req.query("limit") ?? 100,
				queryParamCursor: c.req.query("cursor"),
				queryParamCategories: c.req.queries("category"),
				queryParamSearchQuery: c.req.query("query"),
			});

		const announcements = await announcementService.list(
			validated.queryParamLimit,
			{
				categories: validated.queryParamCategories,
				query: validated.queryParamSearchQuery,
			},
			validated.queryParamCursor,
		);

		return c.json(announcements);
	});

	// Gets an announcement by ID.
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

	// Updates an announcement.
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

	// Deletes an announcement.
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
