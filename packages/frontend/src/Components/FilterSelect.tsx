import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/Components/ui/select";

type FilterOption<T extends string> = {
	label: string;
	value: T;
};

type FilterSelectProps<T extends string> = {
	label: string;
	value: T;
	options: FilterOption<T>[];
	onChange: (value: T | null) => void;
	placeholder?: string;
};

export function FilterSelect<T extends string>({
	label,
	value,
	options,
	onChange,
	placeholder,
}: FilterSelectProps<T>) {
	return (
		<div className="flex flex-col gap-1.5">
			<span className="text-foreground/50 text-[10px] font-bold tracking-wider uppercase">
				{label}
			</span>
			<Select value={value} onValueChange={(v) => onChange(v)}>
				<SelectTrigger className="h-9 min-w-40 text-xs font-bold">
					<SelectValue placeholder={placeholder}>
						{options.find((opt) => opt.value === value)?.label}
					</SelectValue>
				</SelectTrigger>
				<SelectContent align="start">
					{options.map((opt) => (
						<SelectItem key={opt.value} value={opt.value}>
							{opt.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
