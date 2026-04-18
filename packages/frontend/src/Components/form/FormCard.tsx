import type { ReactNode } from "react";

import { FormCardHeader, type FormCardHeaderProps } from "@/Components/form/FormCardHeader";
import { cn } from "@/lib/utils";

type FormCardProps = FormCardHeaderProps & {
	className?: string;
	children: ReactNode;
	footer?: ReactNode;
};

export function FormCard({ className, children, footer, ...headerProps }: FormCardProps) {
	return (
		<div className={cn("card h-140 w-full min-w-100", className)}>
			<FormCardHeader {...headerProps} />

			<div className="flex h-full max-h-130 w-full flex-col gap-4 overflow-y-auto p-6">
				{children}
			</div>

			{footer && <footer className="flex justify-end gap-2">{footer}</footer>}
		</div>
	);
}
