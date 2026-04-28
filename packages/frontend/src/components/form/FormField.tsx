import { cloneElement } from "react";

import type { CloneNode } from "@/components/form/types";
import { Tooltip } from "@/components/ui/tooltip";
import type { UseFormReturn } from "@/hooks/useForm";
import { cn } from "@/lib/utils";

type FormFieldNodeName<F> = keyof F extends string ? keyof F : never;

type FormFieldNodeProps<F> = {
	id: string;
	name: FormFieldNodeName<F>;
	defaultValue?: string | NonNullable<Partial<F>[FormFieldNodeName<F>]>;
};

export type FormFieldProps<T> = {
	id?: string;
	name: FormFieldNodeName<T>;
	label?: string;
	tooltip?: string;
	form: UseFormReturn<T>;
	children: CloneNode<FormFieldNodeProps<T>>;
	className?: string;
	sublabel?: string;
	labelClassName?: string;
	labelPlacement?: "top" | "left" | "right" | "bottom";
};

export function FormField<F>(props: FormFieldProps<F>) {
	const id = props.id ?? props.name;
	const error = props.form.errors[props.name as keyof typeof props.form.errors];

	const node = cloneElement<FormFieldNodeProps<F>>(props.children, {
		id,
		name: props.name,
		defaultValue: props.form.defaultValues?.[props.name] ?? "",
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
