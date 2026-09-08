import { Link } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { Pen } from "lucide-react";
import Time from "../time";
import { Button } from "../ui/button";
import type { DataTableFeatures } from "./table-features";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type Category = {
	id: string;
	name: string;
};

export type Announcement = {
	id: string;
	title: string;
	publicationDate: Date;
	lastUpdate: Date;
	categories: Category[];
};

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, Announcement>();

export const columns = columnHelper.columns([
	columnHelper.accessor("title", {
		header: "Title",
	}),
	columnHelper.accessor("publicationDate", {
		header: "Publication date",
		cell: ({ getValue }) => <Time date={getValue()} />,
	}),

	columnHelper.accessor("lastUpdate", {
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
			<Button
				nativeButton={false}
				render={<Link to={`/announcements/$id`} params={{ id: getValue() }} />}
			>
				<Pen />
				Edit
			</Button>
		),
	}),
]);
