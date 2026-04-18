import { LoaderIcon } from "lucide-react";

export function PendingCard() {
	return (
		<div className="flex min-h-screen w-full items-center justify-center">
			<LoaderIcon className="h-20 w-20 animate-spin" />
		</div>
	);
}
