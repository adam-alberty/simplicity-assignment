import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { getAnnouncementCategories } from "#/lib/announcements/api";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { useState } from "react";
import { Button } from "../ui/button";
import { Filter } from "lucide-react";
import { Card, CardContent } from "../ui/card";

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

	const [filteringOpen, setFilteringOpen] = useState(false);

	return data ? (
		<div>
			<div className="flex">
				<Button
					className="mb-2"
					onClick={() => setFilteringOpen(!filteringOpen)}
				>
					<Filter />
					Filter
				</Button>
			</div>

			{filteringOpen && (
				<Card className="mb-5">
					<CardContent>
						<FieldGroup className="grid grid-cols-4">
							{data.map((cat) => (
								<Field key={cat.id} orientation="horizontal">
									<Checkbox
										id={`filter-category-${cat.id}`}
										name={`filter-category-${cat.id}`}
										checked={
											selectedCategories
												? selectedCategories.includes(cat.id)
												: false
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
															categories: categories?.length
																? categories
																: undefined,
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
						</FieldGroup>
					</CardContent>
				</Card>
			)}
		</div>
	) : (
		<div>Loading</div>
	);
}
