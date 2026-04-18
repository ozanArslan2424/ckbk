import { type } from "arktype";

import { Help } from "@/lib/Help";
import type { StandardSchemaV1 } from "@/lib/standard-schema";
import { isObjectWith } from "@/lib/utils";

export namespace Schema {
	export const bool = type("'true' | 'false' | boolean").pipe((v) => Help.toBoolean(v));

	export interface Schema<T = unknown> extends StandardSchemaV1<unknown, T> {}

	export type Infer<T extends Schema> = StandardSchemaV1.InferOutput<T>;

	export type Validator<T = unknown> = StandardSchemaV1.Props<unknown, T>["validate"];

	export type RouteModel<B = unknown, S = unknown, P = unknown, R = unknown> = {
		response?: Schema<R>;
		body?: Schema<B>;
		search?: Schema<S>;
		params?: Schema<P>;
	};

	export type InferModel<T extends Record<string, any>> = {
		[K in keyof T]: T[K] extends RouteModel<any, any, any, any>
			? Help.Prettify<
					(T[K]["body"] extends Schema ? { body: Infer<T[K]["body"]> } : {}) &
						(T[K]["search"] extends Schema ? { search: Infer<T[K]["search"]> } : {}) &
						(T[K]["params"] extends Schema ? { params: Infer<T[K]["params"]> } : {}) &
						(T[K]["response"] extends Schema ? { response: Infer<T[K]["response"]> } : {})
				>
			: T[K] extends Schema
				? Infer<T[K]>
				: never;
	};
	export type InferModelInstance<T extends new (...args: any[]) => Record<string, any>> =
		InferModel<InstanceType<T>>;

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
