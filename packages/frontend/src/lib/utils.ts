import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { Help } from "@/lib/Help";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function repeat(length: number = 4) {
	return Array.from({ length }, (_, index) => index);
}

export function prefixId(id: number | string, prefix?: string): string {
	if (prefix) {
		return `${prefix}_${id}`;
	}

	const noPrefix = id.toString().split("_")[1];
	Help.assert(noPrefix);
	return noPrefix;
}

export function isValidIndex(
	index: number,
	collection?: Array<unknown> | Set<unknown> | Map<unknown, unknown>,
): boolean {
	if (Number.isNaN(index)) return false;
	if (!Number.isInteger(index)) return false;
	if (index < 0) return false;
	if (collection) {
		const length =
			collection instanceof Set
				? collection.size
				: collection instanceof Map
					? collection.size
					: collection.length;
		return index < length;
	}
	return true;
}

export function getNextIndex(
	input: number,
	collection: Array<unknown>,
	loop: boolean = true,
): number {
	const min = 0;
	const max = collection.length - 1;
	if (input > max) return loop ? min : max;
	if (input < min) return loop ? max : min;
	return input;
}

type TypeMap = {
	string: string;
	number: number;
	boolean: boolean;
	// oxlint-disable-next-line typescript/no-restricted-types
	object: object;
	function: (...args: never[]) => unknown;
	undefined: undefined;
	bigint: bigint;
	symbol: symbol;
	unknown: unknown;
};

export function isObjectWith<K extends string, T extends keyof TypeMap = "unknown">(
	item: unknown,
	key: K,
	keyType?: Exclude<T, "unknown">,
): item is Record<K, TypeMap[T]> {
	if (!item || typeof item !== "object" || !(key in item)) return false;
	if (keyType && typeof (item as Record<K, unknown>)[key] !== keyType) return false;
	return true;
}

export function getErrorMessage(err: unknown): string {
	if (typeof err === "string") return err;

	const paths: string[][] = [
		// axios-like error - specific
		["response", "data", "message"],
		// axios-like error - ambiguous
		["response", "data"],
		// regular error
		["message"],
	];

	for (const path of paths) {
		const value = path.reduce((acc, key) => (isObjectWith(acc, key) ? acc[key] : undefined), err);
		if (typeof value === "string") return value;
	}

	return "unknown";
}
