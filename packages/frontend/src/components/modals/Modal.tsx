import { Dialog as Primitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import type { ReactNode, ComponentProps } from "react";

import { useCommonLocale } from "@/hooks/useCommonLocale";
import type { ModalState } from "@/hooks/useModal";
import { cn } from "@/lib/utils";

export type ModalProps<T = undefined> = ModalState<T> & {
	id?: string;
	showCloseButton?: boolean;
	showTitle?: boolean;
	showDescription?: boolean;
	title: string;
	description: string;
	className?: string;
	children: ReactNode;
	closeButtonProps?: ComponentProps<"button">;
	autoFocus?: boolean;
	disableEscapeClose?: boolean;
};

export function Modal<T = undefined>({
	id,
	open,
	onOpenChange,
	showCloseButton = false,
	showTitle = false,
	showDescription = false,
	title,
	description,
	className,
	children,
	closeButtonProps,
	autoFocus = false,
	ref,
	disableEscapeClose = false,
}: ModalProps<T>) {
	const { txt } = useCommonLocale();

	return (
		<Primitive.Root
			data-slot="dialog"
			open={open}
			onOpenChange={(open, eventDetails) => {
				if (eventDetails.reason === "escape-key" && disableEscapeClose) {
					eventDetails.cancel();
				} else {
					onOpenChange(open);
				}
			}}
		>
			<Primitive.Portal data-slot="dialog-portal">
				<Primitive.Backdrop
					data-slot="dialog-overlay"
					className={cn(
						"fixed inset-0 isolate z-50 bg-black/20 duration-100",
						"supports-backdrop-filter:backdrop-blur-xs",
						"data-open:animate-in",
						"data-open:fade-in-0",
						"data-closed:animate-out",
						"data-closed:fade-out-0",
					)}
				/>
				<Primitive.Popup
					id={id}
					ref={ref}
					autoFocus={autoFocus}
					tabIndex={-1}
					data-slot="dialog-content"
					className={cn(
						"card grid shadow-xl",
						"duration-100 outline-none",
						"fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
						"w-full max-w-[calc(100%-2rem)]",
						"max-h-[calc(100%-2rem)] overflow-y-auto",
						"data-open:animate-in",
						"data-open:fade-in-0",
						"data-open:zoom-in-95",
						"data-closed:animate-out",
						"data-closed:fade-out-0",
						"data-closed:zoom-out-95",
						className,
					)}
				>
					<header
						data-slot="dialog-header"
						className={cn(
							"flex flex-col gap-2 text-center sm:text-left",

							showTitle || showDescription ? "" : "sr-only",
						)}
					>
						<Primitive.Title data-slot="dialog-title" className={showTitle ? "" : "sr-only"}>
							{title}
						</Primitive.Title>
						<Primitive.Description
							data-slot="dialog-description"
							className={showDescription ? "" : "sr-only"}
						>
							{description}
						</Primitive.Description>
					</header>

					<div>{children}</div>

					{showCloseButton && (
						<Primitive.Close
							data-slot="dialog-close"
							{...closeButtonProps}
							className={cn(
								"absolute top-2 right-2 p-1.5",
								"square ghost h-6 w-6",
								"ring-offset-background focus:ring-ring focus:ring-2 focus:ring-offset-2",
								"[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
								closeButtonProps?.className,
							)}
						>
							{closeButtonProps?.children ?? <XIcon />}
							<span className="sr-only">{txt.close}</span>
						</Primitive.Close>
					)}
				</Primitive.Popup>
			</Primitive.Portal>
		</Primitive.Root>
	);
}
