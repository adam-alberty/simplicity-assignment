import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import z from "zod";
import { AlertError } from "#/components/alert-error";
import { columns } from "#/components/announcements/columns";
import { AnnouncementCategoriesFiltering } from "#/components/announcements/filtering";
import { AnnouncementSearch } from "#/components/announcements/search";
import { AnnouncementsTable } from "#/components/announcements/table";
import { TableSkeleton } from "#/components/table-skeleton";
import { Button } from "#/components/ui/button";
import { listAnnouncements } from "#/lib/announcements/api";

export const Route = createFileRoute("/(app)/announcements/")({
	validateSearch: z.object({
		cursor: z.string().optional(),
		categories: z.array(z.uuid()).optional(),
		query: z.string().optional(),
	}),
	component: RouteComponent,
});

function RouteComponent() {
	const { cursor, categories, query } = Route.useSearch();
	const navigate = useNavigate({ from: "/announcements/" });

	const { isPending, isError, error, data } = useQuery({
		queryKey: ["announcements", query, categories, cursor],
		queryFn: () => listAnnouncements({ categories, query }, cursor, 50),
	});

	return (
		<>
			<div className="text-2xl font-bold">Announcements</div>

			<section className="mt-10">
				<div className="flex gap-3 items-end mb-5">
					<AnnouncementSearch />
					<AnnouncementCategoriesFiltering />
				</div>

				{isPending && <TableSkeleton />}
				{data && (
					<>
						<AnnouncementsTable columns={columns} data={data.announcements} />

						<div className="mt-5">
							<Button
								disabled={!data?.prevCursor}
								onClick={() =>
									navigate({
										search: (prev) => ({
											...prev,
											cursor: data.prevCursor ? data.prevCursor : undefined,
										}),
									})
								}
							>
								Previous page
							</Button>

							<Button
								disabled={!data?.nextCursor}
								onClick={() =>
									navigate({
										search: (prev) => ({
											...prev,
											cursor: data.nextCursor ? data.nextCursor : undefined,
										}),
									})
								}
							>
								Next page
							</Button>
						</div>
					</>
				)}
				{isError && <AlertError error={error} />}
			</section>
		</>
	);
}
