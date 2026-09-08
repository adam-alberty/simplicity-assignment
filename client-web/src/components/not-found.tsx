import { Link } from "@tanstack/react-router";
import { CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";

export function NotFoundComponent() {
	return (
		<Empty className="mt-[20vh]">
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<CircleX />
				</EmptyMedia>
				<EmptyTitle>404</EmptyTitle>
				<EmptyDescription>Page not found</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Link to="/">
					<Button>Go home</Button>
				</Link>
			</EmptyContent>
		</Empty>
	);
}
