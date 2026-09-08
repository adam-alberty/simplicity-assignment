import { createFileRoute } from "@tanstack/react-router";
import { type Announcement, columns } from "#/components/announcements/columns";
import { AnnoucementsTable } from "#/components/announcements/table";

export const Route = createFileRoute("/(app)/announcements/")({
	component: RouteComponent,
});

const announcements: Announcement[] = [
	{
		id: crypto.randomUUID(),
		title: "Some announcement",
		categories: [
			{ id: crypto.randomUUID(), name: "city" },
			{ id: crypto.randomUUID(), name: "health" },
		],
		lastUpdate: new Date(),
		publicationDate: new Date(),
	},
];

function RouteComponent() {
	return (
		<>
			<div className="text-2xl font-bold">Announcements</div>
			<section className="mt-10">
				<AnnoucementsTable columns={columns} data={announcements} />
			</section>
		</>
	);
}
