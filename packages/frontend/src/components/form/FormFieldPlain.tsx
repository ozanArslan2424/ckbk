import { cloneElement } from "react";

import type { FormFieldProps } from "@/components/form/FormField";
import type { CloneNode } from "@/components/form/types";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type FormFieldPlainNodeProps = {
	id: string;
	name: string;
	defaultValue?: string | undefined;
};

type FormFieldPlainProps = Omit<FormFieldProps<any>, "form" | "name" | "children"> & {
	name: string;
	error?: string;
	defaultValue?: string | undefined;
	children: CloneNode<FormFieldPlainNodeProps>;
};

export function FormFieldPlain(props: FormFieldPlainProps) {
	const id = props.id ?? props.name;
	const error = props.error;

	const node = cloneElement<FormFieldPlainNodeProps>(props.children, {
		id,
		name: props.name,
		defaultValue: props.defaultValue,
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
