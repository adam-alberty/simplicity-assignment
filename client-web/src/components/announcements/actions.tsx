import { Link } from "@tanstack/react-router";
import { Pen, Trash } from "lucide-react";
import { Button } from "../ui/button";

export function Actions({
	id,
	onDelete,
}: {
	id: string;
	onDelete: (id: string) => void;
}) {
	return (
		<div className="flex justify-end">
			<Button
				variant="secondary"
				nativeButton={false}
				aria-label="Edit announcement"
				render={<Link to={`/announcements/$id`} params={{ id }} />}
			>
				<Pen />
			</Button>

			<Button
				onClick={() => onDelete(id)}
				variant="destructive"
				aria-label="Delete announcement"
			>
				<Trash />
			</Button>
		</div>
	);
}
