import type { WSContext } from "hono/ws";

export class WebSocketManager {
	private clients = new Set<WSContext>();

	add(client: WSContext) {
		this.clients.add(client);
	}

	remove(client: WSContext) {
		this.clients.delete(client);
	}

	broadcast(message: unknown) {
		const data = JSON.stringify(message);

		for (const client of this.clients) {
			if (client.readyState === WebSocket.OPEN) {
				client.send(data);
			}
		}
	}
}
