import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon } from "lucide-react";
import * as React from "react";

import { Modal, type ModalProps } from "@/Components/modals/Modal";
import { cn } from "@/lib/utils";

export function Command({ className, ...props }: React.ComponentProps<typeof CommandPrimitive>) {
	return (
		<CommandPrimitive
			loop
			data-slot="command"
			className={cn(
				"bg-background text-foreground flex h-full w-full flex-col overflow-hidden rounded-md",
				className,
			)}
			{...props}
		/>
	);
}

export function CommandModal<T = undefined>({
	title,
	description,
	className,
	children,
	...rest
}: Omit<ModalProps<T>, "title" | "description"> & {
	title?: string;
	description?: string;
}) {
	return (
		<Modal
			{...rest}
			title={title ?? "Command"}
			description={description ?? "CommandDialog"}
			className={cn("overflow-hidden p-0", className)}
		>
			<Command className="bg-background text-foreground **:[[cmdk-group-heading]]:text-foreground/70 flex h-full w-full flex-col overflow-hidden rounded-lg border shadow-md **:data-[slot=command-input-wrapper]:h-12 md:min-w-112.5 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5 **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group]]:px-2 **:[[cmdk-input]]:h-12 **:[[cmdk-item]]:px-2 **:[[cmdk-item]]:py-3">
				{children}
			</Command>
		</Modal>
	);
}

export function CommandInput({
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
	return (
		<label data-slot="command-input-wrapper" className="flex h-9 items-center gap-2 border-b px-3">
			<SearchIcon className="size-5 shrink-0 opacity-50" />
			<CommandPrimitive.Input
				data-slot="command-input"
				className={cn(
					"h-8 w-full border-transparent bg-transparent py-1 ps-1 pe-3 text-base",
					"focus:border-transparent focus:ring-0 focus:outline-none",
					className,
				)}
				{...props}
			/>
		</label>
	);
}

export function CommandList({
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
	return (
		<CommandPrimitive.List
			data-slot="command-list"
			className={cn("max-h-75 scroll-py-1 overflow-x-hidden overflow-y-auto", className)}
			{...props}
		/>
	);
}

export function CommandEmpty({ ...props }: React.ComponentProps<typeof CommandPrimitive.Empty>) {
	return (
		<CommandPrimitive.Empty
			data-slot="command-empty"
			className="py-6 text-center text-sm"
			{...props}
		/>
	);
}

export function CommandGroup({
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
	return (
		<CommandPrimitive.Group
			data-slot="command-group"
			className={cn("text-foreground overflow-hidden p-2", className)}
			{...props}
		/>
	);
}

export function CommandItem({
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
	return (
		<CommandPrimitive.Item
			data-slot="command-item"
			className={cn(
				"group relative flex cursor-pointer items-center gap-2 rounded-md px-2! py-1! font-medium outline-hidden select-none",
				"bg-background text-foreground",
				"data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground",
				"[&_svg:not([class*='text-'])]:text-foreground/70 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
				"data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
				className,
			)}
			{...props}
		/>
	);
}
