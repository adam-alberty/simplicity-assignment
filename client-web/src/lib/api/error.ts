export class ApiError extends Error {
	constructor(
		public title: string,
		public detail: string,
		public status: number,
		public body: unknown,
	) {
		super(detail);
	}
}
