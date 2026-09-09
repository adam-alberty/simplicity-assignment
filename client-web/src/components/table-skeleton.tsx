import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton() {
	return (
		<div className="flex w-full flex-col gap-2">
			{Array.from({ length: 10 }).map((_, index) => (
				<div className="flex gap-4" key={index}>
					<Skeleton className="h-12 flex-1" />
					<Skeleton className="h-12 w-24" />
					<Skeleton className="h-12 w-20" />
				</div>
			))}
		</div>
	);
}
