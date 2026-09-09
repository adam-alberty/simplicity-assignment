import { z } from "zod";

export const editAnnouncementSchema = z.object({
	title: z.string().min(1),
	content: z.string().min(1),
	categoryIds: z.array(z.string()).min(1),
	publishedAt: z.coerce.date(),
});

export type EditAnnouncementInput = z.infer<typeof editAnnouncementSchema>;
