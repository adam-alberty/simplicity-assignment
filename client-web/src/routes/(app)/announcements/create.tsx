import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AlertError } from "#/components/alert-error";
import {
	EditForm,
	type EditFormValues,
} from "#/components/announcements/edit-form";
import { Button } from "#/components/ui/button";
import { Skeleton } from "#/components/ui/skeleton";
import {
	createAnnouncement,
	getAnnouncementCategories,
} from "#/lib/announcements/api";

export const Route = createFileRoute("/(app)/announcements/create")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const categoriesQuery = useQuery({
		queryKey: ["announcement-categories"],
		queryFn: getAnnouncementCategories,
	});

	const createAnnouncementMutation = useMutation({
		mutationFn: createAnnouncement,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["announcements"],
			});
			navigate({
				to: "/announcements",
			});
		},
	});

	const isPending = categoriesQuery.isPending;
	const error = categoriesQuery.error;
	const categories = categoriesQuery.data;

	const handleSubmit = ({ value }: { value: EditFormValues }) => {
		createAnnouncementMutation.mutate({
			title: value.title,
			content: value.content,
			categoryIds: value.categoryIds,
			publishedAt: new Date(value.publishedAt),
		});
	};

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
			<div className="text-2xl font-bold">Create announcement</div>

			<section className="mt-10">
				{isPending && <Skeleton className="h-[50vh]" />}
				{categories && (
					<EditForm
						announcement={{
							title: "",
							content: "",
							categories: [],
							id: "UNUSED",
							publishedAt: new Date(),
							updatedAt: new Date(),
						}}
						categories={categories}
						error={createAnnouncementMutation.error}
						onSubmit={handleSubmit}
					/>
				)}
				{error && <AlertError error={error} />}
			</section>
		</>
	);
}
