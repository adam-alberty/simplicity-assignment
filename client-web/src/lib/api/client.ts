import { ApiError } from "./error";

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1`;

export async function apiFetch<T>(
	path: string,
	options?: RequestInit,
): Promise<T> {
	let res: Response;
	try {
		res = await fetch(`${API_URL}${path}`, options);
	} catch (err) {
		console.log(err);

		if (err instanceof Error) {
			throw new ApiError("API request error", err.message, 0, null);
		}

		throw new ApiError("API request error", "Unknown error", 0, null);
	}

	if (!res.ok) {
		const data = await res.json();
		throw new ApiError(data.title, data.detail, res.status, res.body);
	}

	return res.json();
}
