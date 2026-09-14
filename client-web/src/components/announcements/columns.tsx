import { createColumnHelper } from "@tanstack/react-table";
import type { Announcement } from "#/lib/announcements/types";
import Time from "../time";
import { Actions } from "./actions";
import type { DataTableFeatures } from "./table-features";

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, Announcement>();

export const createColumns = (onDelete: (id: string) => void) =>
	columnHelper.columns([
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
			cell: ({ getValue }) => <Actions id={getValue()} onDelete={onDelete} />,
		}),
	]);
