import { ApiError } from "./error";

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1`;

export async function apiFetch<T>(
	path: string,
	options?: RequestInit,
): Promise<T> {
	const res = await fetch(`${API_URL}${path}`, options);

	if (!res.ok) {
		const data = await res.json();
		throw new ApiError(data.title, data.detail, res.status, res.body);
	}

	return res.json();
}
