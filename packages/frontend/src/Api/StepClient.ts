import type { Args, CorpusApi, Models } from "@/Api/CorpusApi";
import type { QueryClient } from "@/Query/QueryClient";
import type { MakeMutArgs } from "@/Query/QueryTypes";

export class StepClient {
	constructor(
		private readonly query: QueryClient,
		private readonly api: CorpusApi,
	) {}

	create(args: MakeMutArgs<Models.StepPost>) {
		return this.query.makeMutation<Models.StepPost>({
			mutationFn: (vars) => this.api.stepPost(vars),
			...args,
		});
	}

	listByRecipe(args: Args.StepByRecipeRecipeIdGet) {
		return this.query.makeQuery({
			queryKey: [this.api.endpoints.stepByRecipeRecipeIdGet(args.params)],
			queryFn: () => this.api.stepByRecipeRecipeIdGet(args),
		});
	}
}
