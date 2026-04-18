import * as Tanstack from "@tanstack/react-query";

import type { Help } from "@/lib/Help";

export type BaseModel = {
	body?: unknown;
	search?: Record<string, unknown> | undefined;
	params?: unknown;
	response: unknown;
};

export type MutVars<M extends BaseModel> = Omit<M, "response">;

export type MutRes<M extends BaseModel> = M["response"] extends void
	? void
	: NonNullable<M["response"]>;

export type MutOpts<M extends BaseModel, TOnMutateResult = unknown> = Tanstack.UseMutationOptions<
	MutRes<M>,
	Error,
	MutVars<M>,
	TOnMutateResult
>;

export type MakeMutArgs<M extends BaseModel, TOnMutateResult = any> = Partial<
	Omit<MutOpts<M, TOnMutateResult>, "mutationFn">
>;

export type OnMutSuccess<M extends BaseModel> = (res: MutRes<M>, vars: MutVars<M>) => void;

export type OnMutError<M extends BaseModel> = (err: Error, vars: MutVars<M>) => void;

export type QueryKey = Tanstack.QueryKey;

export type QueryUpdaterArgs<T extends Help.WithId> =
	| { action: "create"; queryKey: QueryKey; data: T; pos?: "start" | "end" }
	| { action: "update"; queryKey: QueryKey; data: Partial<T>; id: T["id"] }
	| { action: "remove"; queryKey: QueryKey; data: T["id"] }
	| { action: "replace"; queryKey: QueryKey; data: T; prevId: T["id"] };
