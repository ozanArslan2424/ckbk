import { useId, useState, useEffect } from "react";

import { useDebounce } from "@/hooks/useDebounce";
import { CONFIG } from "@/lib/CONFIG";

type FilterSearchProps = Omit<React.ComponentProps<"input">, "value" | "onChange"> & {
	label: string;
	value: string;
	onChange: (value: string) => void;
};

export function FilterSearch({
	label,
	value: valueProp,
	onChange: onChangeProp,
	...rest
}: FilterSearchProps) {
	const uid = useId();
	const [value, setValue] = useState<string>(valueProp);
	const debouncedValue = useDebounce(value, CONFIG.debounceMS);

	useEffect(() => {
		setValue(valueProp);
	}, [valueProp]);

	useEffect(() => {
		onChangeProp(debouncedValue);
	}, [debouncedValue, onChangeProp]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value);
	};

	return (
		<div className="flex flex-col gap-1.5">
			<span className="text-foreground/50 text-[10px] font-bold tracking-wider uppercase">
				{label}
			</span>
			<input
				id={`${uid}_filter_search`}
				name={`${uid}_filter_search`}
				type="search"
				className="h-9 min-h-9 max-w-40 text-xs font-bold"
				value={value}
				onChange={handleChange}
				{...rest}
			/>
		</div>
	);
}
