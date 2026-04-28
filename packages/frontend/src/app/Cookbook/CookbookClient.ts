import type { Args, CorpusApi, Models } from "@/lib/CorpusApi";
import type { QueryClient, MutArgs } from "@/lib/QueryClient";

export class CookbookClient {
	constructor(
		private readonly api: CorpusApi,
		private readonly queryClient: QueryClient,
	) {}

	get(args: Args.CookbookIdGet) {
		return this.queryClient.makeQuery({
			queryKey: [this.api.endpoints.cookbookIdGet(args.params), args],
			queryFn: async () => this.api.cookbookIdGet(args),
		});
	}

	create(opts: MutArgs<Models.CookbookPost>) {
		return this.queryClient.makeMutation<Models.CookbookPost>({
			mutationFn: this.api.cookbookPost,
			...opts,
			onSuccess: (res, ...rest) => {
				const q = this.get({ params: { id: res.id } });
				this.queryClient.setQueryData(q.queryKey, res);
				opts.onSuccess?.(res, ...rest);
			},
		});
	}

	update(opts: MutArgs<Models.CookbookIdPut>) {
		return this.queryClient.makeMutation<Models.CookbookIdPut>({
			mutationFn: this.api.cookbookIdPut,
			...opts,
			onSuccess: (res, ...rest) => {
				const q = this.get({ params: { id: res.id } });
				this.queryClient.setQueryData(q.queryKey, res);
				opts.onSuccess?.(res, ...rest);
			},
		});
	}
}
