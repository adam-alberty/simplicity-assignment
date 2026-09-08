import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { EditForm } from "#/components/announcements/edit-form";
import { Button } from "#/components/ui/button";

export const Route = createFileRoute("/(app)/announcements/$id")({
	component: RouteComponent,
});

function RouteComponent() {
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
				<EditForm />
			</section>
		</>
	);
}
