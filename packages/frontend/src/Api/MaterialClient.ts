import type { Args, CorpusApi, Models } from "@/Api/CorpusApi";
import type { QueryClient } from "@/Query/QueryClient";
import type { MakeMutArgs } from "@/Query/QueryTypes";

export class MaterialClient {
	constructor(
		private readonly query: QueryClient,
		private readonly api: CorpusApi,
	) {}

	create(args: MakeMutArgs<Models.MaterialPost>) {
		return this.query.makeMutation<Models.MaterialPost>({
			mutationFn: (vars) => this.api.materialPost(vars),
			...args,
			onSuccess: (res, ...rest) => {
				this.query.updateListData<Models.MaterialPost["response"]>({
					queryKey: [this.api.endpoints.materialPost],
					action: "create",
					data: res,
				});
				args.onSuccess?.(res, ...rest);
			},
		});
	}

	list(args: Args.MaterialGet) {
		return this.query.makeQuery({
			queryKey: [this.api.endpoints.materialGet],
			queryFn: () => this.api.materialGet(args),
		});
	}
}
