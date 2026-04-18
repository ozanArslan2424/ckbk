import { CheckIcon } from "lucide-react";
import { useCallback, useEffect, useState, type ComponentProps, type ReactNode } from "react";

import { Help } from "@/lib/Help";
import { cn } from "@/lib/utils";

type CheckboxProps = {
	id?: string;
	name?: string;
	value?: boolean;
	defaultValue?: boolean;
	onChange?: (checked: boolean) => void;
	renderChildren?: (checked: boolean) => ReactNode;
	unstyled?: boolean;
} & Omit<ComponentProps<"button">, "onChange" | "value">;

export function Checkbox({
	id,
	name,
	value,
	defaultValue,
	onChange,
	className,
	renderChildren,
	unstyled = false,
	...rest
}: CheckboxProps) {
	const isControlled = value !== undefined;
	const [internal, setInternal] = useState<Help.StringBoolean>(
		Help.toStringBoolean(isControlled ? value : defaultValue),
	);

	useEffect(() => {
		if (isControlled) setInternal(Help.toStringBoolean(value));
	}, [isControlled, value]);

	const checked = isControlled ? Help.toBoolean(value) : Help.toBoolean(internal);

	const handleClick = useCallback(() => {
		const next = !checked;
		if (!isControlled) setInternal(Help.toStringBoolean(next));
		onChange?.(next);
	}, [checked, isControlled, onChange]);

	return (
		<>
			<input
				type="text"
				id={`${name}_input`}
				name={name}
				value={internal}
				readOnly
				className="sr-only"
			/>
			<button
				{...rest}
				id={id}
				type="button"
				role="checkbox"
				aria-checked={checked}
				onClick={handleClick}
				className={unstyled ? className : cn("square sm", checked ? "primary" : "soft", className)}
			>
				{renderChildren ? renderChildren(checked) : checked ? <CheckIcon /> : null}
			</button>
		</>
	);
}
