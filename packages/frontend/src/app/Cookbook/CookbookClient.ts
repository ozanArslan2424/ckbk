import type { Args, CorpusApi, Models } from "@/lib/CorpusApi";
import type { QueryClient, MutArgs } from "@/lib/QueryClient";

export class CookBookClient {
	constructor(
		private readonly api: CorpusApi,
		private readonly queryClient: QueryClient,
	) {}

	get(args: Args.CookbookIdGet) {
		return this.queryClient.makeQuery({
			queryKey: [this.api.endpoints.cookbookIdGet(args.params)],
			queryFn: async () => this.api.cookbookIdGet(args),
		});
	}

	create(args: MutArgs<Models.CookbookPost>) {
		return this.queryClient.makeMutation<Models.CookbookPost>({
			mutationFn: this.api.cookbookPost,
			...args,
			onSuccess: (res, ...rest) => {
				this.queryClient.setQueryData([this.api.endpoints.cookbookIdGet({ id: res.id })], res);
				args.onSuccess?.(res, ...rest);
			},
		});
	}

	update(args: MutArgs<Models.CookbookIdPut>) {
		return this.queryClient.makeMutation<Models.CookbookIdPut>({
			mutationFn: this.api.cookbookIdPut,
			...args,
			onSuccess: (res, vars, ...rest) => {
				this.queryClient.setQueryData([this.api.endpoints.cookbookIdGet(vars.params)], res);
				args.onSuccess?.(res, vars, ...rest);
			},
		});
	}
}
