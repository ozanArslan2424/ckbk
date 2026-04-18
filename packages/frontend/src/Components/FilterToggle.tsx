import { cn } from "@/lib/utils";

type FilterToggleProps = Omit<React.ComponentProps<"button">, "value" | "onChange"> & {
	label: string;
	innerText: string;
	value: boolean;
	onChange: (value: boolean) => void;
};

export function FilterToggle({
	label,
	innerText,
	value,
	onChange,
	onClick,
	...rest
}: FilterToggleProps) {
	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		onChange(!value);
		onClick?.(e);
	};

	return (
		<div className="flex flex-col gap-1.5">
			<span className="text-foreground/50 text-[10px] font-bold tracking-wider uppercase">
				{label}
			</span>
			<button
				type="button"
				className="outlined h-9 min-h-9 min-w-40 justify-start gap-3 text-xs font-bold"
				onClick={handleClick}
				{...rest}
			>
				<div
					className={cn(
						"size-2 rounded-full border transition-all",
						value ? "bg-primary border-primary" : "bg-transparent border-foreground/30",
					)}
				/>
				{innerText}
			</button>
		</div>
	);
}
