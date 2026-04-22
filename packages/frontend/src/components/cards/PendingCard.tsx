import { LoaderIcon } from "lucide-react";

export function PendingCard() {
	return (
		<div className="flex min-h-screen w-full items-center justify-center">
			<LoaderIcon className="text-primary size-8 animate-spin" />
		</div>
	);
}
