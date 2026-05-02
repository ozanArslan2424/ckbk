import { useState, useRef, useEffect } from "react";

import type { OptionType } from "@/components/form/types";
import { cn } from "@/lib/utils";
import { useCommonLocale } from "@/locale/useCommonLocale";

type ComboboxProps<O extends OptionType> = {
	id?: string;
	name?: string;
	placeholder?: string;
	searchPlaceholder?: string;
	value?: string | null;
	onValueChange?: (value: string | null) => void;
	onCreateOption?: (option: O) => void;
	options: O[];
	hideCreate?: boolean;
	align?: "center" | "end" | "start";
	side?: "top" | "bottom";
	className?: string;
	disabled?: boolean;
};

export function Combobox<O extends OptionType>({
	id,
	name,
	placeholder,
	searchPlaceholder,
	value,
	onValueChange,
	onCreateOption,
	options,
	hideCreate,
	align = "center",
	side = "bottom",
	className,
	disabled,
}: ComboboxProps<O>) {
	const { txt } = useCommonLocale();
	const [open, setOpen] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const [opts, setOpts] = useState(options);
	const [selected, setSelected] = useState<O | null>(
		opts.find((opt) => opt.value === value) ?? null,
	);

	const containerRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	// Close on outside click
	useEffect(() => {
		if (!open) return () => {};
		function handlePointerDown(e: PointerEvent) {
			if (!containerRef.current?.contains(e.target as Node)) {
				setOpen(false);
				setInputValue("");
			}
		}
		document.addEventListener("pointerdown", handlePointerDown);
		return () => {
			document.removeEventListener("pointerdown", handlePointerDown);
		};
	}, [open]);

	function handleSelect(opt: O | null) {
		setSelected(opt);
		setInputValue("");
		onValueChange?.(opt?.value ?? null);
		setOpen(false);
		inputRef.current?.blur();
	}

	function handleCreateOption(label: string) {
		const newOption = {
			value: label.toLowerCase().replace(/\s+/g, "-"),
			label,
		} as O;
		setOpts((prev) => [...prev, newOption]);
		onCreateOption?.(newOption);
		handleSelect(newOption);
	}

	const filteredOpts = opts.filter((opt) =>
		opt.label.toLowerCase().includes(inputValue.toLowerCase()),
	);

	const optExists = filteredOpts.some(
		(opt) => opt.label.toLowerCase() === inputValue.toLowerCase(),
	);

	const displayValue = open ? inputValue : (selected?.label ?? "");

	const dropdownAlign =
		align === "end" ? "right-0" : align === "start" ? "left-0" : "left-1/2 -translate-x-1/2";
	const dropdownSide = side === "top" ? "bottom-full mb-1" : "top-full mt-1";

	return (
		<div ref={containerRef} className="relative w-full">
			<input
				type="hidden"
				id={id}
				name={name}
				value={selected?.value ?? ""}
				onFocus={(e) => {
					e.preventDefault();
					inputRef.current?.focus();
				}}
			/>
			<input
				disabled={disabled}
				ref={inputRef}
				type="text"
				className={cn(
					"outlined w-full text-sm",
					!selected && !inputValue && "text-muted-foreground",
					className,
				)}
				placeholder={open ? (searchPlaceholder ?? txt.searchPlaceholder) : placeholder}
				value={displayValue}
				onChange={(e) => {
					setInputValue(e.target.value);
					setOpen(true);
				}}
				onFocus={() => setOpen(true)}
			/>
			{open && (
				<div
					className={cn(
						"bg-card absolute z-9999 max-h-40 w-full min-w-max overflow-y-auto rounded-md border p-1.5 shadow-md",
						dropdownAlign,
						dropdownSide,
					)}
				>
					{filteredOpts.map((opt) => (
						<button
							key={opt.value}
							type="button"
							className="ghost sm flex w-full"
							onMouseDown={(e) => {
								e.preventDefault();
								handleSelect(opt);
							}}
						>
							{opt.label}
						</button>
					))}
					{!hideCreate && inputValue && !optExists && (
						<button
							type="button"
							className="ghost sm flex w-full"
							onMouseDown={(e) => {
								e.preventDefault();
								handleCreateOption(inputValue);
							}}
						>
							{txt.create} "{inputValue}"
						</button>
					)}
					<button
						type="button"
						className="ghost sm text-muted-foreground hover:text-foreground flex w-full"
						onMouseDown={(e) => {
							e.preventDefault();
							handleSelect(null);
						}}
					>
						{txt.clear}
					</button>
				</div>
			)}
		</div>
	);
}
