import { Hono } from "hono";

export function createHealthRoutes() {
	const app = new Hono();

	app.get("/", (c) => {
		return c.text("ok");
	});

	return app;
}
