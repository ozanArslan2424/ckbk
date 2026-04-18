import { Help } from "@/lib/Help";

export namespace TXT {
	export function isDefined(input: string | undefined | null): input is string {
		return !!input?.trim();
	}

	export function extract(delimiters: string, input: string): string {
		const [start, end] = delimiters.split("");
		Help.assert(start, "Delimiters must be a string of length 2.");
		Help.assert(end, "Delimiters must be a string of length 2.");

		const startIdx = input.indexOf(start);
		const endIdx = input.indexOf(end, startIdx + 1);

		if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
			return "";
		}

		return input.slice(startIdx + 1, endIdx);
	}

	export function split(mark: string, input: string, minLength?: number): string[] {
		const parts = input
			.split(mark)
			.map((part) => part.trim())
			.filter(Boolean);
		if (minLength) {
			Help.assert(parts.length >= minLength);
		}
		return parts;
	}

	export function until(mark: string, input: string): string {
		const index = input.indexOf(mark);
		return index === -1 ? input : input.slice(0, index);
	}

	export function after(mark: string, input: string): string {
		const index = input.indexOf(mark);
		return index === -1 ? "" : input.slice(index + mark.length);
	}

	export function combine(...args: string[]) {
		return args.join("");
	}

	export function equals(source: string, target: string, modifier?: "upper" | "lower") {
		source = source.trim();
		target = target.trim();

		if (modifier === "upper") {
			return source.toUpperCase() === target.toUpperCase();
		}

		if (modifier === "lower") {
			return source.toUpperCase() === target.toUpperCase();
		}

		return source === target;
	}

	export function path(...segments: (string | undefined)[]): `/${string}` {
		const joined = segments
			.filter(
				(segment): segment is string =>
					segment !== undefined && segment !== null && segment.trim() !== "",
			)
			.map((segment) => segment.replace(/^\/+|\/+$/g, ""))
			.filter((segment) => segment.length > 0)
			.join("/");
		return `/${joined}`;
	}

	export function generateHashId(input: string) {
		let hash = 0;
		for (let i = 0; i < input.length; i++) {
			const char = input.charCodeAt(i);
			hash = (hash << 5) - hash + char;
			hash = hash & hash; // Convert to 32-bit integer
		}
		return Math.abs(hash).toString(36).substring(0, 8);
	}

	export function generateRandomId(input: string) {
		const length = Math.min(input.length, 8);
		let result = "";
		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * input.length);
			result += input[randomIndex];
		}
		return result;
	}

	export function param(path: string, p: Record<string, string | number>): string {
		let result = path;

		for (const [key, value] of Object.entries(p)) {
			const searchString = `:${key}`;
			if (!result.includes(searchString)) {
				throw new Error(`${key} param cannot be applied to ${path}`);
			}
			result = result.replaceAll(searchString, value.toString());
		}

		return result;
	}
}
