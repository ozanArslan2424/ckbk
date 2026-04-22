import type { StandardSchemaV1 } from "@standard-schema/spec";
import { type } from "arktype";

import { Help } from "@/lib/Help";
import { isObjectWith } from "@/lib/utils";

export namespace Schema {
	export interface Schema<T = unknown> extends StandardSchemaV1<unknown, T> {}

	export type Infer<T extends Schema> = StandardSchemaV1.InferOutput<T>;

	export type Validator<T = unknown> = StandardSchemaV1.Props<unknown, T>["validate"];

	export const bool = type("'true' | 'false' | boolean").pipe((v) => Help.toBoolean(v));

	export function issuesToErrorRecord<T>(
		issues: readonly StandardSchemaV1.Issue[],
	): Record<keyof T | "_root", string[] | undefined> {
		const record: Record<keyof T | "_root", string[] | undefined> = {} as any;
		for (const issue of issues) {
			const key =
				!issue.path || issue.path.length === 0
					? "_root"
					: issue.path
							.map((segment) =>
								isObjectWith<{ key: string }>(segment, "key")
									? String(segment.key)
									: String(segment as string),
							)
							.join(".");
			(record[key as keyof T] ??= []).push(issue.message);
		}
		return record;
	}
}
