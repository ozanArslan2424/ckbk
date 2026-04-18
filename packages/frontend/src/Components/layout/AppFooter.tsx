import { cn } from "@/lib/utils";

export function AppFooter() {
	return (
		<footer
			className={cn(
				"w-full max-w-[100vw]",
				"fixed bottom-0 left-0",
				"flex shrink-0 flex-col-reverse items-start justify-start gap-2 sm:flex-row sm:items-center sm:justify-between",
				"pb-2 sm:pb-0",
			)}
		></footer>
	);
}
