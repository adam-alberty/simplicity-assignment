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
	editAnnouncement,
	getAnnouncementCategories,
	getOneAnnouncement,
} from "#/lib/announcements/api";

export const Route = createFileRoute("/(app)/announcements/$id")({
	head: () => ({
		meta: [{ title: "Edit announcement" }],
	}),
	component: RouteComponent,
});

function RouteComponent() {
	const params = Route.useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const announcementQuery = useQuery({
		queryKey: ["announcement", params.id],
		queryFn: () => getOneAnnouncement(params.id),
	});

	const categoriesQuery = useQuery({
		queryKey: ["announcement-categories"],
		queryFn: getAnnouncementCategories,
	});

	const isPending = announcementQuery.isPending || categoriesQuery.isPending;
	const error = announcementQuery.error ?? categoriesQuery.error;
	const announcement = announcementQuery.data;
	const categories = categoriesQuery.data;

	const editAnnouncementMutation = useMutation({
		mutationFn: editAnnouncement,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["announcements"],
			});
			navigate({
				to: "/announcements",
			});
		},
	});

	const handleSubmit = ({ value }: { value: EditFormValues }) => {
		editAnnouncementMutation.mutate({
			id: params.id,
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
			<div className="text-2xl font-bold">Edit announcement</div>

			<section className="mt-10">
				{isPending && <Skeleton className="h-[50vh]" />}
				{announcement && categories && (
					<EditForm
						announcement={announcement}
						categories={categories}
						error={error}
						onSubmit={handleSubmit}
					/>
				)}
				{error && <AlertError error={error} />}
			</section>
		</>
	);
}
