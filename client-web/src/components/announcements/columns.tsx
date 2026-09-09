import { Link } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { Pen } from "lucide-react";
import type { Announcement } from "#/lib/announcements/types";
import Time from "../time";
import { Button } from "../ui/button";
import type { DataTableFeatures } from "./table-features";

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, Announcement>();

export const columns = columnHelper.columns([
	columnHelper.accessor("title", {
		header: "Title",
	}),
	columnHelper.accessor("publishedAt", {
		header: "Publication date",
		cell: ({ getValue }) => <Time date={getValue()} />,
	}),

	columnHelper.accessor("updatedAt", {
		header: "Last update",
		cell: ({ getValue }) => <Time date={getValue()} />,
	}),

	columnHelper.accessor("categories", {
		header: "Categories",
		cell: ({ getValue }) =>
			getValue()
				.map((cat) => cat.name)
				.join(", "),
	}),

	columnHelper.accessor("id", {
		header: "",
		cell: ({ getValue }) => (
			<div className="flex justify-end">
				<Button
					variant="secondary"
					nativeButton={false}
					aria-label="Edit announcement"
					render={
						<Link to={`/announcements/$id`} params={{ id: getValue() }} />
					}
				>
					<Pen />
				</Button>
			</div>
		),
	}),
]);
