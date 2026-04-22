import { Entities, type Args, type CorpusApi, type Models } from "@/lib/CorpusApi";
import type { QueryClient, MutArgs } from "@/lib/QueryClient";

export class StepClient {
	constructor(
		private readonly queryClient: QueryClient,
		private readonly api: CorpusApi,
	) {}

	private readonly listDefaultData: Models.StepByRecipeIdGet["response"] = [];
	private createPlaceholder(partial?: Partial<Entities.Step>) {
		return new Entities.Step({
			id: partial?.id ?? -1,
			order: partial?.order ?? 1,
			body: partial?.body ?? "",
			recipeId: partial?.recipeId ?? -1,
			updatedAt: new Date().toISOString(),
			createdAt: new Date().toISOString(),
		});
	}

	listByRecipeId(stepByRecipeIdGetArgs: Args.StepByRecipeIdGet) {
		return this.queryClient.makeQuery({
			queryKey: [
				this.api.endpoints.stepByRecipeIdGet(stepByRecipeIdGetArgs.params),
				stepByRecipeIdGetArgs,
			],
			queryFn: () => this.api.stepByRecipeIdGet(stepByRecipeIdGetArgs),
		});
	}

	create(stepByRecipeIdGetArgs: Args.StepByRecipeIdGet, stepPostMutArgs: MutArgs<Models.StepPost>) {
		const queryKey = [this.api.endpoints.stepByRecipeIdGet(stepByRecipeIdGetArgs.params)];
		const defaultData = this.listDefaultData;
		return this.queryClient.makeOptimisticMutation<Models.StepPost>({
			mutationFn: this.api.stepPost,
			...stepPostMutArgs,
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
