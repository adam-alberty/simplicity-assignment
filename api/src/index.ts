import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { AnnouncementRepository } from "./announcements/announcement.repository.js";
import { createAnnouncementRoutes } from "./announcements/announcement.routes.js";
import { AnnouncementService } from "./announcements/announcement.service.js";
import { db, mustConnectToDatabase } from "./db/index.js";
import { cors } from "hono/cors";
import { handleError } from "./errors/error-handler.js";

await mustConnectToDatabase();

const announcementRepository = new AnnouncementRepository(db);
const announcementService = new AnnouncementService(announcementRepository);
const announcementRoutes = createAnnouncementRoutes(announcementService);

const app = new Hono();

app.use(logger(), cors());
app.onError(handleError);

const API_PREFIX = "/api/v1";

app.route(`${API_PREFIX}/announcements`, announcementRoutes);

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
