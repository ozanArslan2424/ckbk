import type { ComponentProps } from "react";

import type { ModalState } from "@/Hooks/useModal";
import { useLocale } from "@/lib/Locale/useLocale";
import { cn, prefixId } from "@/lib/utils";

import { Dialog } from "./dialog";

type ConfirmDialogProps = ModalState & {
	title: string;
	description: string;
	confirmProps?: Omit<ComponentProps<"button">, "onClick">;
	cancelProps?: Omit<ComponentProps<"button">, "onClick">;
	onCancel?: () => void;
	onConfirm: () => void;
};

export function ConfirmDialog({
	confirmProps,
	cancelProps,
	onConfirm,
	onCancel,
	id,
	...dialog
}: ConfirmDialogProps) {
	const { t } = useLocale("common");

	function handleCancel() {
		onCancel?.();
		dialog.onOpenChange(false);
	}

	function handleConfirm() {
		onConfirm();
		dialog.onOpenChange(false);
	}

	return (
		<Dialog showTitle showDescription id={prefixId(id, "confirm")} {...dialog}>
			<div className="grid grid-cols-3 gap-4">
				<button
					onClick={handleCancel}
					{...cancelProps}
					className={cn("ghost relative col-span-1", cancelProps?.className)}
				>
					{cancelProps?.children ?? t("cancel")}
				</button>
				<button
					onClick={handleConfirm}
					{...confirmProps}
					className={cn("relative col-span-2", confirmProps?.className)}
				>
					{confirmProps?.children ?? t("confirm")}
				</button>
			</div>
		</Dialog>
	);
}
