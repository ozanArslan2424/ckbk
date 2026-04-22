import { cloneElement, type ReactElement } from "react";

import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type FormFieldPlainProps = {
	id?: string;
	name: string;
	error?: string;
	label?: string;
	tooltip?: string;
	children: ReactElement<
		{ id: string; name: string; defaultValue?: string | undefined },
		React.FunctionComponent
	>;
	className?: string;
	sublabel?: string;
	labelClassName?: string;
	labelPlacement?: "top" | "left" | "right" | "bottom";
};

export function FormFieldPlain(props: FormFieldPlainProps) {
	const id = props.id ?? props.name;
	const error = props.error;

	const node = cloneElement<{
		id: string;
		name: string;
		className?: string;
	}>(props.children, {
		id,
		name: props.name,
	});

	const renderNode = () =>
		props.tooltip ? (
			<Tooltip tip={props.tooltip}>
				<span>{node}</span>
			</Tooltip>
		) : (
			node
		);

	return (
		<div className={cn("flex w-full flex-1 flex-col gap-1", props.className)}>
			<div
				className={cn(
					"flex w-full flex-1",
					props.labelPlacement === undefined && "flex-col items-start gap-1",
					props.labelPlacement === "top" && "flex-col items-start gap-1",
					props.labelPlacement === "bottom" && "flex-col-reverse items-start gap-1",
					props.labelPlacement === "left" && "flex-row items-center justify-start gap-3",
					props.labelPlacement === "right" && "flex-row-reverse items-center justify-end gap-3",
				)}
			>
				{props.label && (
					<label htmlFor={id} className={props.labelClassName}>
						{props.label}
					</label>
				)}
				{renderNode()}
			</div>
			{props.sublabel && (
				<label className="sublabel" htmlFor={id}>
					{props.sublabel}
				</label>
			)}
			{error && (
				<label className="error" htmlFor={id}>
					{error}
				</label>
			)}
		</div>
	);
}
