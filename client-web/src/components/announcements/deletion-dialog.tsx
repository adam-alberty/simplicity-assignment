import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAnnouncement } from "#/lib/announcements/api";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function AnnouncementDeletionDialog({
	id,
	onOpenChange,
}: {
	id: string | null;
	onOpenChange: (v: boolean) => void;
}) {
	const queryClient = useQueryClient();

	const deleteMutation = useMutation({
		mutationFn: deleteAnnouncement,
		onSuccess: () => {
			onOpenChange(false);
			queryClient.invalidateQueries({
				queryKey: ["announcements"],
			});
		},
	});

	return (
		<AlertDialog open={id !== null} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete selected
						announcement.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						variant="destructive"
						onClick={() => id !== null && deleteMutation.mutate(id)}
					>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
