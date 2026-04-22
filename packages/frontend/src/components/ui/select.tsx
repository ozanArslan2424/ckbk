import { Select as SelectPrimitive } from "@base-ui/react/select";
import { ChevronDownIcon, CheckIcon, ChevronUpIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;

function SelectGroup({ ...props }: SelectPrimitive.Group.Props) {
	return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({ ...props }: SelectPrimitive.Value.Props) {
	return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({ className, children, ...rest }: SelectPrimitive.Trigger.Props) {
	return (
		<SelectPrimitive.Trigger
			data-slot="select-trigger"
			className={cn("unset", className)}
			{...rest}
		>
			{children}
			<SelectPrimitive.Icon
				render={<ChevronDownIcon className="text-foreground/70 pointer-events-none size-4" />}
			/>
		</SelectPrimitive.Trigger>
	);
}

function SelectContent({
	children,
	side = "bottom",
	sideOffset = 4,
	align = "center",
	alignOffset = 0,
	alignItemWithTrigger = false,
	...rest
}: SelectPrimitive.Popup.Props &
	Pick<
		SelectPrimitive.Positioner.Props,
		"align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
	>) {
	return (
		<SelectPrimitive.Portal>
			<SelectPrimitive.Positioner
				side={side}
				sideOffset={sideOffset}
				align={align}
				alignOffset={alignOffset}
				alignItemWithTrigger={alignItemWithTrigger}
				className="isolate z-50"
			>
				<SelectPrimitive.Popup data-slot="select-content" {...rest}>
					<SelectPrimitive.ScrollUpArrow data-slot="select-scroll-up-button">
						<ChevronUpIcon />
					</SelectPrimitive.ScrollUpArrow>
					<SelectPrimitive.List>{children}</SelectPrimitive.List>
					<SelectPrimitive.ScrollDownArrow data-slot="select-scroll-down-button">
						<ChevronDownIcon />
					</SelectPrimitive.ScrollDownArrow>
				</SelectPrimitive.Popup>
			</SelectPrimitive.Positioner>
		</SelectPrimitive.Portal>
	);
}

function SelectLabel({ ...props }: SelectPrimitive.GroupLabel.Props) {
	return <SelectPrimitive.GroupLabel data-slot="select-label" {...props} />;
}

function SelectItem({ children, ...props }: SelectPrimitive.Item.Props) {
	return (
		<SelectPrimitive.Item data-slot="select-item" {...props}>
			<SelectPrimitive.ItemText className="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
				{children}
			</SelectPrimitive.ItemText>
			<SelectPrimitive.ItemIndicator
				render={
					<span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center" />
				}
			>
				<CheckIcon className="pointer-events-none" />
			</SelectPrimitive.ItemIndicator>
		</SelectPrimitive.Item>
	);
}

function SelectSeparator({ ...props }: SelectPrimitive.Separator.Props) {
	return <SelectPrimitive.Separator data-slot="select-separator" {...props} />;
}

export {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
};
