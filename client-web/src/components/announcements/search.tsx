import { useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { Field } from "../ui/field";
import { Input } from "../ui/input";

export function AnnouncementSearch() {
	const { query } = useSearch({
		from: "/(app)/announcements/",
	});
	const navigate = useNavigate({ from: "/announcements/" });

	const [searchQuery, setSearchQuery] = useState(query || "");

	const handleSearch = () => {
		navigate({
			search: (prev) => ({
				...prev,
				query: searchQuery || undefined,
			}),
		});
	};

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				handleSearch();
			}}
		>
			<Field className="w-sm">
				<ButtonGroup>
					<Input
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						id="announcement-search"
						placeholder="Search announcements"
					/>
					<Button variant="outline" type="submit">
						Search
					</Button>
				</ButtonGroup>
			</Field>
		</form>
	);
}
