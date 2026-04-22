import { Entities, type Args, type CorpusApi, type Models } from "@/lib/CorpusApi";
import type { MutArgs, QueryClient } from "@/lib/QueryClient";

export class IngredientClient {
	constructor(
		private readonly queryClient: QueryClient,
		private readonly api: CorpusApi,
	) {}

	private readonly listDefaultData: Models.IngredientByRecipeIdGet["response"] = [];
	private createPlaceholder(partial?: Partial<Entities.Ingredient>) {
		return new Entities.Ingredient({
			id: partial?.id ?? -1,
			quantity: partial?.quantity ?? 0,
			materialId: partial?.materialId ?? -1,
			material: partial?.material ?? "",
			measurementId: partial?.measurementId ?? -1,
			measurement: partial?.measurement ?? "",
			recipeId: partial?.recipeId ?? -1,
			updatedAt: new Date().toISOString(),
			createdAt: new Date().toISOString(),
		});
	}

	listByRecipeId(ingredientByRecipeIdGetArgs: Args.IngredientByRecipeIdGet) {
		return this.queryClient.makeQuery({
			queryKey: [
				this.api.endpoints.ingredientByRecipeIdGet(ingredientByRecipeIdGetArgs.params),
				ingredientByRecipeIdGetArgs,
			],
			queryFn: async () => this.api.ingredientByRecipeIdGet(ingredientByRecipeIdGetArgs),
		});
	}

	create(
		ingredientByRecipeIdGetArgs: Args.IngredientByRecipeIdGet,
		ingredientPostMutArgs: MutArgs<Models.IngredientPost>,
	) {
		const queryKey = [
			this.api.endpoints.ingredientByRecipeIdGet(ingredientByRecipeIdGetArgs.params),
		];
		const defaultData = this.listDefaultData;
		return this.queryClient.makeOptimisticMutation<Models.IngredientPost>({
			mutationFn: this.api.ingredientPost,
			...ingredientPostMutArgs,
			onMutate: (vars) => {
				const snapshot = this.queryClient.readQueryData(queryKey, defaultData);
				const placeholders = snapshot.filter(({ id }) => id < 0);
				const minId = placeholders.reduce((min, { id }) => Math.min(min, id), 0);
				const id = minId - 1;
				const updated = [this.createPlaceholder({ ...vars.body, id }), ...snapshot];
				this.queryClient.setQueryData(queryKey, updated);
				return {
					succeed: (data) =>
						this.queryClient.updateQueryData(queryKey, defaultData, (prev) =>
							prev.map((mat) => (mat.id === id ? data : mat)),
						),
					fail: () =>
						this.queryClient.updateQueryData(queryKey, defaultData, (prev) =>
							prev.filter((mat) => mat.id !== id),
						),
				};
			},
		});
	}
}
