import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { AnnouncementCategoryRepository } from "./announcements/categories/repository.js";
import { createAnnouncementCategoryRoutes } from "./announcements/categories/routes.js";
import { AnnouncementCategoryService } from "./announcements/categories/service.js";
import { AnnouncementRepository } from "./announcements/repository.js";
import { createAnnouncementRoutes } from "./announcements/routes.js";
import { AnnouncementService } from "./announcements/service.js";
import { db, mustConnectToDatabase } from "./db/index.js";
import { seedDatabase } from "./db/seed.js";
import { handleError } from "./errors/error-handler.js";

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
