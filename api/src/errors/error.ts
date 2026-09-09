import type { ContentfulStatusCode } from "hono/utils/http-status";

export class AppError extends Error {
	constructor(
		public readonly title: string,
		public readonly detail: string,
		public readonly status: ContentfulStatusCode,
	) {
		super(detail);
	}
}
