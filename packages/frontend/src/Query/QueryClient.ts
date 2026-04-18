import * as Tanstack from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { toast } from "sonner";

import type { Help } from "@/lib/Help";
import type {
	BaseModel,
	MutOpts,
	MutRes,
	MutVars,
	QueryKey,
	QueryUpdaterArgs,
} from "@/Query/QueryTypes";

export class QueryClient extends Tanstack.QueryClient {
	constructor(readonly queryConfig: Tanstack.QueryClientConfig) {
		super(queryConfig);
	}

	makeQuery = queryOptions;

	makeMutation = <M extends BaseModel, TOnMutateResult = unknown>(
		options: MutOpts<M, TOnMutateResult>,
	) => options;

	makeOptimisticMutation = <M extends BaseModel, TQueryData = unknown>({
		queryKey,
		updater,
		onChange,
		...options
	}: MutOpts<M, () => void> & {
		queryKey: QueryKey;
		updater: (prev: TQueryData, vars: MutVars<M>) => TQueryData;
		onChange?: (res: MutRes<M> | undefined, err: Error | null, vars: MutVars<M>) => void;
	}): MutOpts<M, () => void> => ({
		onMutate: (vars, ctx) => {
			const snapshot = ctx.client.getQueryData<TQueryData>(queryKey);
			ctx.client.setQueryData<TQueryData>(queryKey, (prev) => {
				if (!prev) return prev;
				return updater(prev, vars);
			});
			return () => {
				ctx.client.setQueryData(queryKey, snapshot);
			};
		},
		onSettled: (res, err, vars, revert) => {
			onChange?.(res, err, vars);
			if (err) {
				toast.error(err.message);
				revert?.();
			}
		},
		...options,
	});

	invalidateAll(...queryKeys: QueryKey[]) {
		return Promise.all(queryKeys.map((queryKey) => this.invalidateQueries({ queryKey })));
	}

	updateListData<T extends Help.WithId>(args: QueryUpdaterArgs<T>) {
		const snapshot = this.getQueryData(args.queryKey);

		this.setQueryData<T[]>(args.queryKey, (prev) => {
			if (!prev) return [];
			switch (args.action) {
				case "create":
					return args.pos === "start" ? [args.data, ...prev] : [...prev, args.data];
				case "update":
					return prev.map((t) => (t.id === args.id ? { ...t, ...args.data } : t));
				case "remove":
					return prev.filter((t) => t.id !== args.data);
				case "replace":
					return prev.map((t) => (t.id === args.prevId ? args.data : t));
				default:
					return [];
			}
		});

		const revert = () => {
			this.setQueryData(args.queryKey, snapshot);
		};

		return revert;
	}

	failAfter(ms: number = 2000, msg?: string): Promise<never> {
		return new Promise((_, reject) => {
			setTimeout(() => reject(new Error(msg)), ms);
		});
	}
}
