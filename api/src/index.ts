import { serve, upgradeWebSocket } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { WebSocketServer } from "ws";
import { db, mustConnectToDatabase } from "@/db/index.js";
import { seedDatabase } from "@/db/seed.js";
import { handleError } from "@/errors/handler.js";
import { AnnouncementCategoryRepository } from "@/modules/announcements/categories/repository.js";
import { createAnnouncementCategoryRoutes } from "@/modules/announcements/categories/routes.js";
import { AnnouncementCategoryService } from "@/modules/announcements/categories/service.js";
import { AnnouncementRepository } from "@/modules/announcements/repository.js";
import { createAnnouncementRoutes } from "@/modules/announcements/routes.js";
import { AnnouncementService } from "@/modules/announcements/service.js";
import { WebSocketManager } from "@/websocket/manager.js";

await mustConnectToDatabase();
await seedDatabase();

const app = new Hono();

// Global middleware
app.use(logger(), cors());

// Global error handling
app.onError(handleError);

const API_PREFIX = "/api/v1";

const wsManager = new WebSocketManager();

// Announcements
const announcementRepository = new AnnouncementRepository(db);
const announcementService = new AnnouncementService(
	announcementRepository,
	wsManager.broadcast,
);
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

// Websocket
app.get(
	`${API_PREFIX}/ws`,
	upgradeWebSocket(() => ({
		onOpen(_event, ws) {
			wsManager.add(ws);
		},

		onClose(_event, ws) {
			wsManager.remove(ws);
		},
	})),
);

// Healthcheck endpoint
app.get("/healthz", (c) => {
	c.status(200);
	return c.text("ok");
});

serve(
	{
		fetch: app.fetch,
		port: 8080,
		websocket: { server: new WebSocketServer({ noServer: true }) },
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);
