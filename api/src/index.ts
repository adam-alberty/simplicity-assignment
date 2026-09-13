import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { WebSocketServer } from "ws";
import { initializeDatabase } from "@/db/index.js";
import { handleError } from "@/errors/handler.js";
import { AnnouncementCategoryRepository } from "@/modules/announcements/categories/repository.js";
import { createAnnouncementCategoryRoutes } from "@/modules/announcements/categories/routes.js";
import { AnnouncementCategoryService } from "@/modules/announcements/categories/service.js";
import { AnnouncementRepository } from "@/modules/announcements/repository.js";
import { createAnnouncementRoutes } from "@/modules/announcements/routes.js";
import { AnnouncementService } from "@/modules/announcements/service.js";
import { WebSocketManager } from "@/websocket/manager.js";
import { seedDatabase } from "./db/seed.js";
import { createHealthRoutes } from "./health/routes.js";
import { AnnouncementSearchRepository } from "./modules/announcements/search/repository.js";
import { initializeSearch } from "./typesense/index.js";
import { createWebSocketRoutes } from "./websocket/routes.js";

const dbClient = await initializeDatabase();
const searchClient = await initializeSearch();

await seedDatabase(dbClient, searchClient);

const app = new Hono();

// Global middleware
app.use(logger(), cors());

// Global error handling
app.onError(handleError);

const API_PREFIX = "/api/v1";

const wsManager = new WebSocketManager();

// Announcements
const announcementRepository = new AnnouncementRepository(dbClient);
const announcementSearchRepository = new AnnouncementSearchRepository(
	searchClient,
);
const announcementService = new AnnouncementService(
	announcementRepository,
	announcementSearchRepository,
	wsManager.broadcast.bind(wsManager),
);
const announcementRoutes = createAnnouncementRoutes(announcementService);

// Announcement categories
const announcementCategoryRepository = new AnnouncementCategoryRepository(
	dbClient,
);
const announcementCategoryService = new AnnouncementCategoryService(
	announcementCategoryRepository,
);
const announcementCategoryRoutes = createAnnouncementCategoryRoutes(
	announcementCategoryService,
);

// Routes
app.route(`${API_PREFIX}/announcements`, announcementRoutes);
app.route(`${API_PREFIX}/announcement-categories`, announcementCategoryRoutes);
app.route(`${API_PREFIX}/ws`, createWebSocketRoutes(wsManager));
app.route("/healthz", createHealthRoutes());

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
