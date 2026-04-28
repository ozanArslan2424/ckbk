import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { useId, useState } from "react";

import type { OptionType } from "@/components/form/types";
import { cn } from "@/lib/utils";

type RadioGridProps<T extends string> = Omit<
	RadioGroupPrimitive.Props,
	"value" | "defaultValue" | "onValueChange" | "name" | "onChange"
> & {
	id?: string;
	name?: string;
	form?: string;
	options: readonly OptionType<T>[];
	value?: T;
	defaultValue?: T;
	onChange?: (value: T) => void;
	required?: boolean;
	className?: string;
	itemClassName?: string;
};

export function RadioGrid<T extends string>({
	className,
	itemClassName,
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
}: RadioGridProps<T>) {
	const isControlled = value !== undefined;
	const [internalValue, setInternalValue] = useState<T | undefined>(defaultValue);
	const currentValue = isControlled ? value : internalValue;

	const handleValueChange = (next: unknown) => {
		const nextValue = next as T;
		if (!isControlled) setInternalValue(nextValue);
		onChange?.(nextValue);
	};

	const reactId = useId();
	const groupId = id ?? reactId;

	const count = options.length;
	const columns = count === 2 ? 2 : count === 1 ? 1 : 3;

	return (
		<>
			{name && (
				<input
					type="hidden"
					name={name}
					form={form}
					value={currentValue ?? ""}
					required={required}
				/>
			)}
			<RadioGroupPrimitive
				id={groupId}
				data-slot="radio-group"
				value={currentValue}
				onValueChange={handleValueChange}
				disabled={disabled}
				className={cn(
					"grid w-full gap-2",
					columns === 1 && "grid-cols-1",
					columns === 2 && "grid-cols-2",
					columns === 3 && "grid-cols-3",
					className,
				)}
				{...props}
			>
				{options.map((option) => (
					<RadioPrimitive.Root
						key={option.value}
						value={option.value}
						data-slot="radio-group-item"
						className={cn(
							"group/radio-group-item relative inline-flex h-9 cursor-pointer items-center justify-center rounded-md border border-border px-3 text-sm font-medium  transition-colors outline-none",
							"bg-secondary text-secondary-foreground",
							"hover:bg-secondary/80",
							"focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
							"data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground",
							"data-disabled:cursor-not-allowed data-disabled:opacity-50",
							itemClassName,
						)}
					>
						{option.label}
					</RadioPrimitive.Root>
				))}
			</RadioGroupPrimitive>
		</>
	);
}
