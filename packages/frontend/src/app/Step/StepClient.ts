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

	listByRecipeId(args: Args.StepByRecipeIdGet) {
		return this.queryClient.makeQuery({
			queryKey: [this.api.endpoints.stepByRecipeIdGet(args.params), args],
			queryFn: async () => this.api.stepByRecipeIdGet(args),
		});
	}

	create(args: Args.StepByRecipeIdGet, opts: MutArgs<Models.StepPost>) {
		const q = this.listByRecipeId(args);

		return this.queryClient.makeOptimisticMutation<Models.StepPost>({
			mutationFn: this.api.stepPost,
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

	clearList(args: Args.StepByRecipeIdGet) {
		const q = this.listByRecipeId(args);

		return this.queryClient.updateQueryData(q.queryKey, this.listDefaultData, () => []);
	}

	addToList(args: Args.StepByRecipeIdGet, step: Entities.Step) {
		const q = this.listByRecipeId(args);

		return this.queryClient.updateQueryData(q.queryKey, this.listDefaultData, (prev) => [
			...prev,
			step,
		]);
	}

	updateInList(
		args: Args.StepByRecipeIdGet,
		id: Entities.Step["id"],
		updater: (prev: Entities.Step) => Entities.Step,
	) {
		const q = this.listByRecipeId(args);

		return this.queryClient.updateQueryData(q.queryKey, this.listDefaultData, (prev) =>
			prev.map((mat) => (mat.id === id ? updater(mat) : mat)),
		);
	}
}
