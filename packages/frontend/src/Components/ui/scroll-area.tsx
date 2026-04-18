import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { useRef, useState, useEffect, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export function ScrollArea({
	children,
	className = "max-h-64",
	gradient = "from-card via-card/80",
}: {
	children: ReactNode;
	className?: string;
	gradient?: string;
}) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [isOverflowing, setIsOverflowing] = useState(false);

	useEffect(() => {
		const checkOverflow = () => {
			const container = containerRef.current;
			if (container) {
				setIsOverflowing(container.scrollHeight > container.clientHeight);
			}
		};

		checkOverflow();
		const observer = new ResizeObserver(checkOverflow);
		if (containerRef.current) observer.observe(containerRef.current);

		return () => observer.disconnect();
	}, []);

	return (
		<ScrollAreaPrimitive.Root data-slot="scroll-area" tabIndex={-1}>
			<ScrollAreaPrimitive.Viewport data-slot="scroll-area-viewport" tabIndex={-1}>
				<div ref={containerRef} className={cn("relative", className)} tabIndex={-1}>
					{children}
					{isOverflowing && (
						<div
							className={cn(
								"pointer-events-none sticky right-0 -bottom-2 left-0 h-12 bg-linear-to-t to-transparent",
								gradient,
							)}
						/>
					)}
				</div>
				<ScrollBar />
			</ScrollAreaPrimitive.Viewport>
		</ScrollAreaPrimitive.Root>
	);
}

function ScrollBar({
	className,
	orientation = "vertical",
	...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
	return (
		<ScrollAreaPrimitive.ScrollAreaScrollbar
			data-slot="scroll-area-scrollbar"
			orientation={orientation}
			className={cn(
				"flex touch-none p-px transition-colors select-none",
				orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent",
				orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent",
				className,
			)}
			{...props}
		>
			<ScrollAreaPrimitive.ScrollAreaThumb
				data-slot="scroll-area-thumb"
				className="bg-border relative flex-1 rounded-full"
			/>
		</ScrollAreaPrimitive.ScrollAreaScrollbar>
	);
}
