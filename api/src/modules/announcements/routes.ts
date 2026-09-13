import { Hono } from "hono";
import z from "zod";
import { AppError } from "@/errors/error.js";
import { createAnnouncementSchema } from "./schema.js";
import type { AnnouncementService } from "./service.js";

export function createAnnouncementRoutes(
	announcementService: AnnouncementService,
) {
	const app = new Hono();

	// Lists announcements.
	app.get("/", async (c) => {
		const validated = z
			.object({
				limit: z.coerce.number().min(1).max(100),
				cursor: z.string().optional(),
				categoryIds: z.array(z.uuid()).optional(),
				query: z.string().optional(),
			})
			.parse({
				limit: c.req.query("limit") ?? 100,
				cursor: c.req.query("cursor"),
				categoryIds: c.req.queries("category"),
				query: c.req.query("query"),
			});

		const announcements = await announcementService.list({
			limit: validated.limit,
			query: validated.query,
			cursor: validated.cursor,
			categories: validated.categoryIds,
		});

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

	// Creates an announcement.
	app.post("/", async (c) => {
		const parsedBody = z.parse(createAnnouncementSchema, await c.req.json());
		parsedBody.updatedAt = undefined;

		await announcementService.create(parsedBody);

		return c.json({ success: true });
	});

	// Updates an announcement.
	app.patch("/:id", async (c) => {
		const validated = z
			.object({
				announcementId: z.uuid(),
			})
			.parse({ announcementId: c.req.param("id") });

		const parsedBody = z.parse(createAnnouncementSchema, await c.req.json());

		parsedBody.updatedAt = undefined;

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
