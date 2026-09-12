import { Hono } from "hono";
import type { AnnouncementCategoryService } from "./service.js";

export function createAnnouncementCategoryRoutes(
	categoriesService: AnnouncementCategoryService,
) {
	const app = new Hono();

	app.get("/", async (c) => {
		const categories = await categoriesService.list();

		return c.json(categories);
	});

	return app;
}
