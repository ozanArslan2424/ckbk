import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="skeleton"
			className={cn("bg-card/50 border-border/30 animate-pulse rounded-md border", className)}
			{...props}
		/>
	);
}

export { Skeleton };
