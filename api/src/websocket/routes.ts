import { upgradeWebSocket } from "@hono/node-server";
import { Hono } from "hono";
import type { WebSocketManager } from "./manager.js";

export function createWebSocketRoutes(wsManager: WebSocketManager) {
	const app = new Hono();

	app.get(
		"/",
		upgradeWebSocket(() => ({
			onOpen(_event, ws) {
				wsManager.add(ws);
			},

			onClose(_event, ws) {
				wsManager.remove(ws);
			},
		})),
	);

	return app;
}
