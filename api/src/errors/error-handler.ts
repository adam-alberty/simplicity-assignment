import type { Context } from "hono";
import z from "zod";
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

	if (err instanceof z.ZodError) {
		err.issues;

		return c.json(
			{
				title: "Validation failed",
				detail: "One or more fields are invalid.",
				errors: err.issues.map((issue) => ({
					field: issue.path.join("."),
					message: issue.message,
					code: issue.code,
				})),
			},
			400,
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
