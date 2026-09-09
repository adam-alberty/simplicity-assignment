import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { AnnouncementRepository } from "./announcements/announcement.repository.js";
import { createAnnouncementRoutes } from "./announcements/announcement.routes.js";
import { AnnouncementService } from "./announcements/announcement.service.js";
import { AnnouncementCategoryRepository } from "./announcements/categories/category.repository.js";
import { createAnnouncementCategoryRoutes } from "./announcements/categories/category.routes.js";
import { AnnouncementCategoryService } from "./announcements/categories/category.service.js";
import { db, mustConnectToDatabase } from "./db/index.js";
import { handleError } from "./errors/error-handler.js";
import { seedDatabase } from "./db/seed.js";

await mustConnectToDatabase();
await seedDatabase();

const app = new Hono();

app.use(logger(), cors());
app.onError(handleError);

const API_PREFIX = "/api/v1";

// Announcements
const announcementRepository = new AnnouncementRepository(db);
const announcementService = new AnnouncementService(announcementRepository);
const announcementRoutes = createAnnouncementRoutes(announcementService);
app.route(`${API_PREFIX}/announcements`, announcementRoutes);

// Announcement categories
const announcementCategoryRepository = new AnnouncementCategoryRepository(db);
const announcementCategoryService = new AnnouncementCategoryService(
	announcementCategoryRepository,
);
const announcementCategoryRoutes = createAnnouncementCategoryRoutes(
	announcementCategoryService,
);
app.route(`${API_PREFIX}/announcement-categories`, announcementCategoryRoutes);

// Healthcheck endpoint
app.get("/healthz", (c) => {
	c.status(200);
	return c.text("ok");
});

serve(
	{
		fetch: app.fetch,
		port: 8080,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);
