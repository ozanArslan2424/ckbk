import type { CorpusApi, Models, Args } from "@/lib/CorpusApi";
import { Entities } from "@/lib/CorpusApi";
import type { MutArgs, QueryClient } from "@/lib/QueryClient";

export class IngredientClient {
	constructor(
		private readonly api: CorpusApi,
		private readonly queryClient: QueryClient,
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

	listByRecipeId(args: Args.IngredientByRecipeIdGet) {
		return this.queryClient.makeQuery({
			queryKey: [this.api.endpoints.ingredientByRecipeIdGet(args.params), args],
			queryFn: () => this.api.ingredientByRecipeIdGet(args),
		});
	}

	create(args: Args.IngredientByRecipeIdGet, opts: MutArgs<Models.IngredientPost>) {
		const q = this.listByRecipeId(args);

		return this.queryClient.makeOptimisticMutation<Models.IngredientPost>({
			mutationFn: this.api.ingredientPost,
			...opts,
			onMutate: (vars) => {
				const snapshot = this.queryClient.readQueryData(q.queryKey, this.listDefaultData);
				const placeholders = snapshot.filter(({ id }) => id < 0);
				const minId = placeholders.reduce((min, { id }) => Math.min(min, id), 0);
				const id = minId - 1;
				const updated = [this.createPlaceholder({ ...vars.body, id }), ...snapshot];
				this.queryClient.setQueryData(q.queryKey, updated);
				return {
					succeed: (data) =>
						this.queryClient.updateQueryData(q.queryKey, this.listDefaultData, (prev) =>
							prev.map((mat) => (mat.id === id ? data : mat)),
						),
					fail: () =>
						this.queryClient.updateQueryData(q.queryKey, this.listDefaultData, (prev) =>
							prev.filter((mat) => mat.id !== id),
						),
				};
			},
		});
	}

	clearList(args: Args.IngredientByRecipeIdGet) {
		const q = this.listByRecipeId(args);

		return this.queryClient.updateQueryData(q.queryKey, this.listDefaultData, () => []);
	}

	addToList(args: Args.IngredientByRecipeIdGet, ingredient: Entities.Ingredient) {
		const q = this.listByRecipeId(args);

		return this.queryClient.updateQueryData(q.queryKey, this.listDefaultData, (prev) => [
			...prev,
			ingredient,
		]);
	}

	updateInList(
		args: Args.IngredientByRecipeIdGet,
		id: Entities.Ingredient["id"],
		updater: (prev: Entities.Ingredient) => Entities.Ingredient,
	) {
		const q = this.listByRecipeId(args);

		return this.queryClient.updateQueryData(q.queryKey, this.listDefaultData, (prev) =>
			prev.map((mat) => (mat.id === id ? updater(mat) : mat)),
		);
	}
}
