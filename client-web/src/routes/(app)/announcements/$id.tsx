import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AlertError } from "#/components/alert-error";
import { EditForm } from "#/components/announcements/edit-form";
import { Button } from "#/components/ui/button";
import { Skeleton } from "#/components/ui/skeleton";
import { getOneAnnouncement } from "#/lib/announcements/api";

export const Route = createFileRoute("/(app)/announcements/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	const params = Route.useParams();

	const { isPending, isError, error, data } = useQuery({
		queryKey: ["one-announcement"],
		queryFn: () => getOneAnnouncement(params.id),
	});

	return (
		<>
			<Button
				nativeButton={false}
				className="mx-0 px-0 text-muted-foreground"
				variant="link"
				render={<Link to="/announcements" />}
			>
				<ArrowLeft />
				Back to announcements
			</Button>
			<div className="text-2xl font-bold">Edit announcement</div>

			<section className="mt-10">
				{isPending && <Skeleton className="h-[50vh]" />}
				{data && <EditForm announcement={data} />}
				{isError && <AlertError error={error} />}
			</section>
		</>
	);
}
