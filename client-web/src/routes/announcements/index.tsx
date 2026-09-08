import { columns, type Announcement } from '#/components/announcements/columns';
import { AnnoucementsTable } from '#/components/announcements/table';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/announcements/')({
	component: RouteComponent,
});

const announcements: Announcement[] = [
	{
		id: crypto.randomUUID(),
		title: 'Some announcement',
		categories: [
			{ id: crypto.randomUUID(), name: 'city' },
			{ id: crypto.randomUUID(), name: 'health' },
		],
		lastUpdate: new Date(),
		publicationDate: new Date(),
	},
];

function RouteComponent() {
	return (
		<div className="container mx-auto">
			<div className="text-xl font-bold">Announcements</div>

			<section className="mt-10">
				<AnnoucementsTable columns={columns} data={announcements} />
			</section>
		</div>
	);
}
