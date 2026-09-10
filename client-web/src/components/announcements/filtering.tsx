import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Filter } from "lucide-react";
import { getAnnouncementCategories } from "#/lib/announcements/api";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldLabel } from "../ui/field";

export function AnnouncementCategoriesFiltering() {
	// TODO handle errors
	const { data } = useQuery({
		queryKey: ["announcement-categories"],
		queryFn: getAnnouncementCategories,
	});

	const { categories: selectedCategories } = useSearch({
		from: "/(app)/announcements/",
	});
	const navigate = useNavigate({ from: "/announcements/" });

	return data ? (
		<DropdownMenu>
			<DropdownMenuTrigger render={<Button variant="outline" />}>
				<Filter />
				{selectedCategories && selectedCategories.length > 0 ? (
					<>
						{selectedCategories.length}{" "}
						{`categor${selectedCategories.length > 1 ? "ies" : "y"}`} selected
					</>
				) : (
					<>Filter categories</>
				)}
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				{data.map((cat) => (
					<Field className="py-1" key={cat.id} orientation="horizontal">
						<Checkbox
							id={`filter-category-${cat.id}`}
							name={`filter-category-${cat.id}`}
							checked={
								selectedCategories ? selectedCategories.includes(cat.id) : false
							}
							onCheckedChange={(checked) => {
								if (checked) {
									navigate({
										search: (prev) => ({
											...prev,
											cursor: undefined,
											categories: prev.categories
												? [...prev.categories, cat.id]
												: [cat.id],
										}),
									});
								} else {
									navigate({
										search: (prev) => {
											const categories = prev.categories?.filter(
												(catId) => catId !== cat.id,
											);

											return {
												...prev,
												cursor: undefined,
												categories: categories?.length ? categories : undefined,
											};
										},
									});
								}
							}}
						/>
						<FieldLabel htmlFor={`filter-category-${cat.id}`}>
							{cat.name}
						</FieldLabel>
					</Field>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	) : (
		<div>Loading</div>
	);
}
