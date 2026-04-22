import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import * as React from "react";

export function DropdownMenu({
	children,
	...rest
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
	return (
		<DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...rest}>
			{children}
		</DropdownMenuPrimitive.Root>
	);
}

export function DropdownMenuTrigger({ children }: { children: React.ReactNode }) {
	return (
		<DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" asChild>
			{children}
		</DropdownMenuPrimitive.Trigger>
	);
}

export function DropdownMenuContent({
	sideOffset = 4,
	side = "bottom",
	align = "start",
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
	return (
		<DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal">
			<DropdownMenuPrimitive.Content
				data-slot="dropdown-menu-content"
				sideOffset={sideOffset}
				side={side}
				align={align}
				{...props}
			/>
		</DropdownMenuPrimitive.Portal>
	);
}

export function DropdownMenuGroup({
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
	return <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}

export function DropdownMenuItem({
	inset,
	variant = "default",
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
	inset?: boolean;
	variant?: "default" | "destructive";
}) {
	return (
		<DropdownMenuPrimitive.Item
			data-slot="dropdown-menu-item"
			data-inset={inset}
			data-variant={variant}
			className="sm"
			{...props}
		/>
	);
}

export function DropdownMenuCheckboxItem({
	children,
	checked,
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
	return (
		<DropdownMenuPrimitive.CheckboxItem
			data-slot="dropdown-menu-checkbox-item"
			checked={checked}
			{...props}
		>
			<span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
				<DropdownMenuPrimitive.ItemIndicator>
					<CheckIcon className="size-4" />
				</DropdownMenuPrimitive.ItemIndicator>
			</span>
			{children}
		</DropdownMenuPrimitive.CheckboxItem>
	);
}

export function DropdownMenuRadioGroup({
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
	return <DropdownMenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />;
}

export function DropdownMenuRadioItem({
	children,
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
	return (
		<DropdownMenuPrimitive.RadioItem data-slot="dropdown-menu-radio-item" {...props}>
			<span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
				<DropdownMenuPrimitive.ItemIndicator>
					<CircleIcon className="size-2 fill-current" />
				</DropdownMenuPrimitive.ItemIndicator>
			</span>
			{children}
		</DropdownMenuPrimitive.RadioItem>
	);
}

export function DropdownMenuLabel({
	inset,
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
	inset?: boolean;
}) {
	return (
		<DropdownMenuPrimitive.Label data-slot="dropdown-menu-label" data-inset={inset} {...props} />
	);
}

export function DropdownMenuSeparator({
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
	return <DropdownMenuPrimitive.Separator data-slot="dropdown-menu-separator" {...props} />;
}

export function DropdownMenuShortcut({ ...props }: React.ComponentProps<"span">) {
	return <span data-slot="dropdown-menu-shortcut" {...props} />;
}

export function DropdownMenuSub({
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
	return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

export function DropdownMenuSubTrigger({
	inset,
	children,
	chevron = "right",
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
	inset?: boolean;
	chevron?: "left" | "right";
}) {
	return (
		<DropdownMenuPrimitive.SubTrigger
			data-slot="dropdown-menu-sub-trigger"
			data-inset={inset}
			{...props}
		>
			{chevron === "left" && <ChevronLeftIcon className="mr-2 size-4" />}
			{children}
			{chevron === "right" && <ChevronRightIcon className="ml-auto size-4" />}
		</DropdownMenuPrimitive.SubTrigger>
	);
}

export function DropdownMenuSubContent({
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
	return <DropdownMenuPrimitive.SubContent data-slot="dropdown-menu-sub-content" {...props} />;
}
