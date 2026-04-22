import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

type TooltipProps = ComponentProps<typeof TooltipPrimitive.Content> & {
	delayDuration?: number;
	tip: ReactNode;
};

export function Tooltip({
	delayDuration = 0,
	tip,
	sideOffset = 0,
	className,
	children,
	...rest
}: TooltipProps) {
	return (
		<TooltipPrimitive.Provider data-slot="tooltip-provider" delayDuration={delayDuration}>
			<TooltipPrimitive.Root data-slot="tooltip">
				<TooltipPrimitive.Trigger data-slot="tooltip-trigger" asChild>
					{children}
				</TooltipPrimitive.Trigger>

				<TooltipPrimitive.Portal>
					<TooltipPrimitive.Content
						data-slot="tooltip-content"
						sideOffset={sideOffset}
						className={cn(
							"bg-card text-card-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
							className,
						)}
						{...rest}
					>
						{tip}
						<TooltipPrimitive.Arrow className="bg-card fill-card z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px]" />
					</TooltipPrimitive.Content>
				</TooltipPrimitive.Portal>
			</TooltipPrimitive.Root>
		</TooltipPrimitive.Provider>
	);
}
