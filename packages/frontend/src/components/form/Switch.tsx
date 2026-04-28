import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { useId, useState } from "react";

import type { OptionType } from "@/components/form/types";
import { cn } from "@/lib/utils";

type SwitchProps<T extends string> = Omit<
	SwitchPrimitive.Root.Props,
	| "checked"
	| "defaultChecked"
	| "onCheckedChange"
	| "value"
	| "defaultValue"
	| "name"
	| "id"
	| "onChange"
> & {
	size?: "sm" | "default";
	id?: string;
	name?: string;
	form?: string;
	options: readonly [OptionType<T>, OptionType<T>];
	value?: T;
	defaultValue?: T;
	onChange?: (value: T) => void;
	className?: string;
	labelClassName?: string;
	wrapperClassName?: string;
};

export function Switch<T extends string>({
	className,
	wrapperClassName,
	labelClassName,
	size = "default",
	id,
	name,
	form,
	options,
	value,
	defaultValue,
	onChange,
	disabled,
	required,
	...props
}: SwitchProps<T>) {
	const [offOption, onOption] = options;

	const isControlled = value !== undefined;
	const [internalValue, setInternalValue] = useState<T>(defaultValue ?? offOption.value);
	const currentValue = isControlled ? value : internalValue;
	const checked = currentValue === onOption.value;
	const currentLabel = checked ? onOption.label : offOption.label;

	const handleCheckedChange = (next: boolean) => {
		const nextValue = next ? onOption.value : offOption.value;
		if (!isControlled) setInternalValue(nextValue);
		onChange?.(nextValue);
	};

	const reactId = useId();
	const switchId = id ?? reactId;

	return (
		<div className={cn("inline-flex items-center gap-2", wrapperClassName)}>
			{name && (
				<input type="hidden" name={name} form={form} value={currentValue} required={required} />
			)}
			<SwitchPrimitive.Root
				id={switchId}
				data-slot="switch"
				data-size={size}
				checked={checked}
				onCheckedChange={handleCheckedChange}
				disabled={disabled}
				className={cn(
					"peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-all outline-none",
					"after:absolute after:-inset-x-3 after:-inset-y-2",
					"focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
					"aria-invalid:border-accent aria-invalid:ring-3 aria-invalid:ring-accent/30",
					"data-[size=default]:h-[18.4px] data-[size=default]:w-8 data-[size=sm]:h-3.5 data-[size=sm]:w-6",
					"data-checked:bg-primary data-unchecked:bg-tertiary",
					"data-disabled:cursor-not-allowed data-disabled:opacity-50",
					className,
				)}
				{...props}
			>
				<SwitchPrimitive.Thumb
					data-slot="switch-thumb"
					className={cn(
						"pointer-events-none block rounded-full ring-0 shadow-sm transition-transform",
						"bg-white",
						"group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3",
						"group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)]",
						"group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0",
					)}
				/>
			</SwitchPrimitive.Root>
			<label htmlFor={switchId} className={cn("text-sm select-none", labelClassName)}>
				{currentLabel}
			</label>
		</div>
	);
}
