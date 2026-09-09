import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AlertError } from "#/components/alert-error";
import { columns } from "#/components/announcements/columns";
import { AnnoucementsTable } from "#/components/announcements/table";
import { TableSkeleton } from "#/components/table-skeleton";
import { listAnnouncements } from "#/lib/announcements/api";

export const Route = createFileRoute("/(app)/announcements/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { isPending, isError, error, data } = useQuery({
		queryKey: ["announcements"],
		queryFn: listAnnouncements,
	});

	return (
		<>
			<div className="text-2xl font-bold">Announcements</div>
			<section className="mt-10">
				{isPending && <TableSkeleton />}
				{data && <AnnoucementsTable columns={columns} data={data} />}
				{isError && <AlertError error={error} />}
			</section>
		</>
	);
}
