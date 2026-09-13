import { z } from "zod";

export const createAnnouncementSchema = z.object({
	title: z.string().min(1),
	content: z.string().min(1),
	categoryIds: z.array(z.string()).min(1),
	publishedAt: z.coerce.date(),
	updatedAt: z.coerce.date().optional(),
});

export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>;
