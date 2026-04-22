import type { ComponentProps } from "react";

import { CONFIG } from "@/lib/CONFIG";
import { cn } from "@/lib/utils";

export function PageContent({
	className,
	browserTitle = CONFIG.appTitle,
	children,
	...rest
}: ComponentProps<"div"> & { browserTitle?: string }) {
	return (
		<div
			className={cn("flex w-full flex-col gap-4 px-4 py-5 md:gap-6 md:py-7 lg:px-8", className)}
			{...rest}
		>
			<title>{browserTitle}</title>
			{children}
		</div>
	);
}
