import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { getRelativeTimeString, getTimeString } from "@/lib/time";

export default function Time({ date }: { date: Date }) {
	const relative = getRelativeTimeString(date);
	const absolute = getTimeString(date);

	return (
		<Tooltip>
			<TooltipTrigger>{absolute}</TooltipTrigger>
			<TooltipContent>{relative}</TooltipContent>
		</Tooltip>
	);
}
