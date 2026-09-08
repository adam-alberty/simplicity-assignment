import type { ErrorComponentProps } from "@tanstack/react-router";
import { CircleX } from "lucide-react";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "./ui/button";

export function ErrorComponent({ error, reset }: ErrorComponentProps) {
	return (
		<Empty className="mt-[20vh]">
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<CircleX />
				</EmptyMedia>
				<EmptyTitle>Something went wrong</EmptyTitle>
				<EmptyDescription>
					{error instanceof Error ? error.message : null}
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Button onClick={reset}>Try Again</Button>
			</EmptyContent>
		</Empty>
	);
}
