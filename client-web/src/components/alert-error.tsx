import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ApiError } from "#/lib/api/error";

export function AlertError({ error }: { error: Error }) {
	let errorTitle = error.name;
	let errorMessage = error.message;

	if (error instanceof ApiError) {
		errorTitle = `(${error.status}) ${error.title}`;
		errorMessage = error.message;
	}

	return (
		<Alert variant="destructive">
			<AlertCircleIcon />
			<AlertTitle>{errorTitle}</AlertTitle>
			<AlertDescription>{errorMessage}</AlertDescription>
		</Alert>
	);
}
