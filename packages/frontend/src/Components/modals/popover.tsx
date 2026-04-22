import * as PopoverPrimitive from "@radix-ui/react-popover";
import type { ReactNode, ComponentProps } from "react";
import { Drawer } from "vaul";

import { useIsMobile } from "@/hooks/useIsMobile";
import type { ModalState } from "@/hooks/useModal";
import { cn } from "@/lib/utils";

type PopoverProps = Omit<ModalState, "ref" | "data" | "handleOpen"> & {
	trigger?: ReactNode;
	className?: string;
	align?: ComponentProps<typeof PopoverPrimitive.Content>["align"];
	side?: ComponentProps<typeof PopoverPrimitive.Content>["side"];
	sideOffset?: number;
	children: ReactNode;
};

export function Popover({
	trigger,
	className,
	align = "center",
	side = "bottom",
	sideOffset = 4,
	children,
	...dialog
}: PopoverProps) {
	const isMobile = useIsMobile();

	if (isMobile) {
		return (
			<Drawer.Root data-slot="drawer" {...dialog}>
				{trigger && (
					<Drawer.Trigger data-slot="drawer-trigger" asChild>
						{trigger}
					</Drawer.Trigger>
				)}

				<Drawer.Portal data-slot="drawer-portal">
					<Drawer.Overlay
						data-slot="drawer-overlay"
						className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50"
					/>
					<Drawer.Content
						data-slot="drawer-content"
						className={cn(
							"group/drawer-content bg-background fixed z-50 flex h-auto flex-col",
							"data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b",
							"data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t",
							"data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm",
							"data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm",
							className,
						)}
					>
						<div className="bg-secondary mx-auto mt-4 hidden h-2 w-25 shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />

						{children}
					</Drawer.Content>
				</Drawer.Portal>
			</Drawer.Root>
		);
	}

	return (
		<PopoverPrimitive.Root data-slot="popover" {...dialog}>
			{trigger && (
				<PopoverPrimitive.Trigger data-slot="popover-trigger" asChild>
					{trigger}
				</PopoverPrimitive.Trigger>
			)}

			<PopoverPrimitive.Portal>
				<PopoverPrimitive.Content
					data-slot="popover-content"
					align={align}
					side={side}
					sideOffset={sideOffset}
					className={cn(
						"bg-card text-card-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
						className,
					)}
				>
					{children}
				</PopoverPrimitive.Content>
			</PopoverPrimitive.Portal>
		</PopoverPrimitive.Root>
	);
}
