export type AnnouncementCursor = {
	updatedAt: Date;
	id: string;
};

export function encodeAnnouncementCursor(cursor: AnnouncementCursor): string {
	return Buffer.from(JSON.stringify(cursor)).toString("base64url");
}

export function decodeAnnouncementCursor(cursor: string): AnnouncementCursor {
	const decoded = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8"));
	decoded.updatedAt = new Date(decoded.updatedAt);
	return decoded;
}
