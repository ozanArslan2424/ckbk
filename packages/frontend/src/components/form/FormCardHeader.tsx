import type { ReactNode } from "react";

export type FormCardHeaderProps = {
	title: string;
	cornerSlot?: ReactNode;
};

export function FormCardHeader({ title, cornerSlot }: FormCardHeaderProps) {
	return (
		<div className="bg-muted/50 flex items-center justify-between border-b px-4 py-3">
			<div className="flex items-center gap-2">
				<span className="text-sm font-semibold">{title}</span>
			</div>
			{cornerSlot}
		</div>
	);
}
