import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertError } from "#/components/alert-error";
import { columns } from "#/components/announcements/columns";
import { AnnouncementsTable } from "#/components/announcements/table";
import { TableSkeleton } from "#/components/table-skeleton";
import { listAnnouncements } from "#/lib/announcements/api";
import z from "zod";
import { Button } from "#/components/ui/button";

export const Route = createFileRoute("/(app)/announcements/")({
	validateSearch: z.object({
		cursor: z.string().optional(),
	}),
	component: RouteComponent,
});

function RouteComponent() {
	const { cursor } = Route.useSearch();
	const navigate = useNavigate();

	const { isPending, isError, error, data } = useQuery({
		queryKey: ["announcements", cursor],
		queryFn: () => listAnnouncements(cursor, 50),
	});

	return (
		<>
			<div className="text-2xl font-bold">Announcements</div>
			<section className="mt-10">
				{isPending && <TableSkeleton />}
				{data && (
					<>
						<AnnouncementsTable columns={columns} data={data.announcements} />

						<div className="mt-5">
							<Button
								disabled={!data?.prevCursor}
								onClick={() =>
									navigate({
										to: "/announcements",
										search: {
											cursor: data.prevCursor ? data.prevCursor : undefined,
										},
									})
								}
							>
								Previous page
							</Button>

							<Button
								disabled={!data?.nextCursor}
								onClick={() =>
									navigate({
										to: "/announcements",
										search: {
											cursor: data.nextCursor ? data.nextCursor : undefined,
										},
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
