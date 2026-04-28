import * as Tanstack from "@tanstack/react-query";
import { toast } from "sonner";

import { getErrorMessage, isObjectWith } from "@/lib/utils";

export type BaseModel = {
	body?: unknown;
	search?: Record<string, unknown> | undefined;
	params?: unknown;
	response: unknown;
};

export type MutOpts<M extends BaseModel, TOnMutateResult = unknown> = Tanstack.UseMutationOptions<
	M["response"] extends void ? void : NonNullable<M["response"]>,
	Error,
	Omit<M, "response">,
	TOnMutateResult
>;

export type MutArgs<M extends BaseModel, TOnMutateResult = any> = Partial<
	Omit<MutOpts<M, TOnMutateResult>, "mutationFn">
>;

export type BaseOptMutData<M extends BaseModel> = {
	succeed: (data: M["response"]) => void;
	fail: () => void;
};

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

	async invalidateAll(...queryKeys: Tanstack.QueryKey[]) {
		return Promise.all(queryKeys.map(async (queryKey) => this.invalidateQueries({ queryKey })));
	}

	readQueryData<QData, QKey extends Tanstack.QueryKey = Tanstack.QueryKey>(
		queryKey: QKey,
		defaultData: QData,
	): QData {
		return this.getQueryData<QData>(queryKey) ?? defaultData;
	}

	updateQueryData<QData, QKey extends Tanstack.QueryKey = Tanstack.QueryKey>(
		queryKey: QKey,
		defaultPrev: QData,
		cb: (prev: Tanstack.NoInfer<QData>) => QData,
	): () => QData | undefined {
		const snapshot = this.getQueryData<QData>(queryKey);
		this.setQueryData<QData>(queryKey, (prev) => {
			prev ??= defaultPrev;
			return cb(prev);
		});
		return () => {
			this.setQueryData<QData>(queryKey, snapshot);
			return snapshot;
		};
	}

	updateInfiniteQueryData<QData, QKey extends Tanstack.QueryKey = Tanstack.QueryKey>(
		queryKey: QKey,
		defaultPrev: QData,
		find: (page: QData) => boolean,
		cb: (prev: Tanstack.NoInfer<QData>) => QData,
	): () => Tanstack.InfiniteData<QData> | undefined {
		const snapshot = this.getQueryData<Tanstack.InfiniteData<QData>>(queryKey);
		this.setQueryData<Tanstack.InfiniteData<QData>>(queryKey, (prevList) => {
			prevList ??= { pages: [], pageParams: [1] };
			let prev = prevList.pages.find((page) => find(page)) ?? prevList.pages[0];
			prev ??= defaultPrev;
			const next = cb(prev);
			return {
				...prevList,
				pages: prevList.pages.map((page) => (page === prev ? next : page)),
			};
		});
		return () => {
			this.setQueryData<Tanstack.InfiniteData<QData>>(queryKey, snapshot);
			return snapshot;
		};
	}

	constructor() {
		function handleRetry(failCount: number, err: unknown): boolean {
			if (!isObjectWith(err, "status", "number")) return false;

			const TIMEOUT_RETRY = 3;
			if ([408, 504].includes(err.status)) return failCount < TIMEOUT_RETRY;

			return false;
		}

		function handleMutationSettle(res: unknown, err: Error | null) {
			if (isObjectWith(res, "message", "string")) {
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
