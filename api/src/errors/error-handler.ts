import type { Context } from "hono";
import { AppError } from "./error.js";

export function handleError(err: unknown, c: Context) {
	if (err instanceof AppError) {
		return c.json(
			{
				title: err.title,
				detail: err.detail,
			},
			err.status,
		);
	}

	console.error(err);

	return c.json(
		{
			title: "Internal server error",
			detail: "An unexpected error occurred.",
		},
		500,
	);
}
