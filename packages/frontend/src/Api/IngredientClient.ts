import type { Args, CorpusApi, Models } from "@/Api/CorpusApi";
import type { QueryClient } from "@/Query/QueryClient";
import type { MakeMutArgs } from "@/Query/QueryTypes";

export class IngredientClient {
	constructor(
		private readonly query: QueryClient,
		private readonly api: CorpusApi,
	) {}

	create(args: MakeMutArgs<Models.IngredientPost>) {
		return this.query.makeMutation<Models.IngredientPost>({
			mutationFn: (vars) => this.api.ingredientPost(vars),
			...args,
		});
	}

	listByRecipe(args: Args.IngredientByRecipeRecipeIdGet) {
		return this.query.makeQuery({
			queryKey: [this.api.endpoints.ingredientByRecipeRecipeIdGet(args.params)],
			queryFn: () => this.api.ingredientByRecipeRecipeIdGet(args),
		});
	}
}
