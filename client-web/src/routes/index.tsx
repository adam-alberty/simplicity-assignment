import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from '@/components/ui/empty';

export const Route = createFileRoute('/')({ component: Home });

function Home() {
	return (
		<div className="flex justify-center items-center">
			<Empty className="mt-[20vh]">
				<EmptyHeader>
					<EmptyTitle>Nothing to see here</EmptyTitle>
					<EmptyDescription>
						Head to announcements to see something interesting.
					</EmptyDescription>
				</EmptyHeader>
				<EmptyContent className="flex-row justify-center gap-2">
					<Button>
						<Link to="/announcements">Go to announcements</Link>
					</Button>
				</EmptyContent>
			</Empty>
		</div>
	);
}
