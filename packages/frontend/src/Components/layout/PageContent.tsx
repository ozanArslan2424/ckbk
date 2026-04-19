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
			className={cn("px-4 lg:px-12 flex w-full flex-col gap-4 py-4 md:gap-6 md:py-6", className)}
			{...rest}
		>
			<title>{browserTitle}</title>
			{children}
		</div>
	);
}
