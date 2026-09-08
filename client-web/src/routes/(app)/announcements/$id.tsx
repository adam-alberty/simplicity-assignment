import { createFileRoute } from "@tanstack/react-router";
import { EditForm } from "#/components/announcements/edit-form";

export const Route = createFileRoute("/(app)/announcements/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<div className="text-2xl font-bold">Edit announcement</div>
			<section className="mt-10">
				<EditForm />
			</section>
		</>
	);
}
