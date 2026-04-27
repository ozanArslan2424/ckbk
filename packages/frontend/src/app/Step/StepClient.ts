import type { CorpusApi, Models, Args } from "@/lib/CorpusApi";
import { Entities } from "@/lib/CorpusApi";
import type { MutArgs, QueryClient } from "@/lib/QueryClient";

export class StepClient {
	constructor(
		private readonly api: CorpusApi,
		private readonly queryClient: QueryClient,
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
			queryFn: async () => this.api.stepByRecipeIdGet(stepByRecipeIdGetArgs),
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

	clearList(stepByRecipeIdGetArgs: Args.StepByRecipeIdGet) {
		const queryKey = [
			this.api.endpoints.stepByRecipeIdGet(stepByRecipeIdGetArgs.params),
			stepByRecipeIdGetArgs,
		];
		return this.queryClient.updateQueryData(queryKey, this.listDefaultData, () => []);
	}

	addToList(stepByRecipeIdGetArgs: Args.StepByRecipeIdGet, step: Entities.Step) {
		const queryKey = [
			this.api.endpoints.stepByRecipeIdGet(stepByRecipeIdGetArgs.params),
			stepByRecipeIdGetArgs,
		];
		return this.queryClient.updateQueryData(queryKey, this.listDefaultData, (prev) => [
			...prev,
			step,
		]);
	}

	updateInList(
		stepByRecipeIdGetArgs: Args.StepByRecipeIdGet,
		id: Entities.Step["id"],
		updater: (prev: Entities.Step) => Entities.Step,
	) {
		const queryKey = [
			this.api.endpoints.stepByRecipeIdGet(stepByRecipeIdGetArgs.params),
			stepByRecipeIdGetArgs,
		];
		return this.queryClient.updateQueryData(queryKey, this.listDefaultData, (prev) =>
			prev.map((mat) => (mat.id === id ? updater(mat) : mat)),
		);
	}
}
