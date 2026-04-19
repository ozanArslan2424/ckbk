import type { ComponentProps } from "react";

import type { ModalState } from "@/Hooks/useModal";
import { cn, prefixId } from "@/lib/utils";
import { useCommonLocale } from "@/Locale/useCommonLocale";

import { Modal } from "./Modal";

type ConfirmModalProps = ModalState & {
	title: string;
	description: string;
	confirmProps?: Omit<ComponentProps<"button">, "onClick">;
	cancelProps?: Omit<ComponentProps<"button">, "onClick">;
	onCancel?: () => void;
	onConfirm: () => void;
};

export function ConfirmModal({
	confirmProps,
	cancelProps,
	onConfirm,
	onCancel,
	id,
	...dialog
}: ConfirmModalProps) {
	const { txt } = useCommonLocale();

	function handleCancel() {
		onCancel?.();
		dialog.onOpenChange(false);
	}

	function handleConfirm() {
		onConfirm();
		dialog.onOpenChange(false);
	}

	return (
		<Modal showTitle showDescription id={prefixId(id, "confirm")} {...dialog}>
			<div className="grid grid-cols-3 gap-4">
				<button
					onClick={handleCancel}
					{...cancelProps}
					className={cn("ghost relative col-span-1", cancelProps?.className)}
				>
					{cancelProps?.children ?? txt.cancel}
				</button>
				<button
					onClick={handleConfirm}
					{...confirmProps}
					className={cn("relative col-span-2", confirmProps?.className)}
				>
					{confirmProps?.children ?? txt.confirm}
				</button>
			</div>
		</Modal>
	);
}
