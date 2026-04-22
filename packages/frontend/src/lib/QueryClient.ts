import * as Tanstack from "@tanstack/react-query";
import { toast } from "sonner";

import { getErrorMessage, isObjectWith } from "@/lib/utils";

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

export type MutArgs<M extends BaseModel, TOnMutateResult = any> = Partial<
	Omit<MutOpts<M, TOnMutateResult>, "mutationFn">
>;

export type OnMutSuccess<M extends BaseModel> = (res: MutRes<M>, vars: MutVars<M>) => void;

export type OnMutError<M extends BaseModel> = (err: Error, vars: MutVars<M>) => void;

export type BaseOptMutData<M extends BaseModel> = {
	succeed: (data: M["response"]) => void;
	fail: () => void;
};

export type InfiniteQueryData<D> = {
	pages: Array<D>;
	pageParams: Array<number>;
};

export type QueryKey = Tanstack.QueryKey;

export class QueryClient extends Tanstack.QueryClient {
	makeQuery = Tanstack.queryOptions;
	makeInfiniteQuery = Tanstack.infiniteQueryOptions;

	makeMutation = <M extends BaseModel, TOnMutateResult = unknown>(
		options: MutOpts<M, TOnMutateResult>,
	) => options;

	makeOptimisticMutation = <M extends BaseModel, OMR extends BaseOptMutData<M> = BaseOptMutData<M>>(
		opts: MutOpts<M, OMR>,
	): MutOpts<M, OMR> => ({
		...opts,
		onSettled: (data, error, variables, onMutateResult, context) => {
			if (data) {
				onMutateResult?.succeed(data);
			} else {
				onMutateResult?.fail();
			}
			opts.onSettled?.(data, error, variables, onMutateResult, context);
		},
	});

	invalidateAll(...queryKeys: QueryKey[]) {
		return Promise.all(queryKeys.map((queryKey) => this.invalidateQueries({ queryKey })));
	}

	readQueryData<QData, QKey extends QueryKey = QueryKey>(
		queryKey: QKey,
		defaultData: QData,
	): QData {
		return this.getQueryData<QData>(queryKey) ?? defaultData;
	}

	updateQueryData<QData, QKey extends QueryKey = QueryKey>(
		queryKey: QKey,
		defaultPrev: QData,
		cb: (prev: Tanstack.NoInfer<QData>) => QData,
	): () => QData | undefined {
		const snapshot = this.getQueryData<QData>(queryKey);
		this.setQueryData<QData>(queryKey, (prev) => {
			if (!prev) prev = defaultPrev;
			return cb(prev);
		});
		return () => {
			this.setQueryData<QData>(queryKey, snapshot);
			return snapshot;
		};
	}

	updateInfiniteQueryData<QData, QKey extends QueryKey = QueryKey>(
		queryKey: QKey,
		defaultPrev: QData,
		find: (page: QData) => boolean,
		cb: (prev: Tanstack.NoInfer<QData>) => QData,
	): () => InfiniteQueryData<QData> | undefined {
		const snapshot = this.getQueryData<InfiniteQueryData<QData>>(queryKey);
		this.setQueryData<InfiniteQueryData<QData>>(queryKey, (prevList) => {
			if (!prevList) prevList = { pages: [], pageParams: [1] };
			let prev = prevList.pages.find((page) => find(page)) || prevList.pages[0];
			if (!prev) prev = defaultPrev;
			const next = cb(prev);
			return {
				...prevList,
				pages: prevList.pages.map((page) => (page === prev ? next : page)),
			};
		});
		return () => {
			this.setQueryData<InfiniteQueryData<QData>>(queryKey, snapshot);
			return snapshot;
		};
	}

	constructor() {
		function handleRetry(failCount: number, error: unknown) {
			const RETRY_LIMIT = 3;

			if (isObjectWith<{ status: number }>(error, "status") && typeof error.status === "number") {
				const isTimeout = [408, 504].includes(error.status);

				if (isTimeout) {
					return failCount < RETRY_LIMIT;
				} else if (error.status > 400) {
					return false;
				} else {
					return false;
				}
			}

			return false;
		}

		function handleMutationSettle(res: unknown, err: Error | null) {
			if (isObjectWith<{ message: string }>(res, "message")) {
				toast.success(res.message);
			} else if (err) {
				if (import.meta.env.NODE_ENV !== "production") {
					console.log(err);
				}
				toast.error(getErrorMessage(err));
			}
		}

		super({
			defaultOptions: {
				queries: {
					retry: handleRetry,
					staleTime: Infinity,
					refetchOnWindowFocus: false,
				},
				mutations: {
					retry: handleRetry,
					onSettled: handleMutationSettle,
				},
			},
		});
	}
}
