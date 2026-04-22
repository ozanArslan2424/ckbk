import { type Args, type CorpusApi, Entities, type Models } from "@/lib/CorpusApi";
import type { MutArgs, QueryClient } from "@/lib/QueryClient";

export class MaterialClient {
	constructor(
		private readonly queryClient: QueryClient,
		private readonly api: CorpusApi,
	) {}

	private readonly listDefaultData: Models.MaterialGet["response"] = [];
	private createPlaceholder(partial?: Partial<Entities.Material>) {
		return new Entities.Material({
			id: partial?.id ?? -1,
			title: partial?.title ?? "",
			description: partial?.description ?? "",
			updatedAt: new Date().toISOString(),
			createdAt: new Date().toISOString(),
		});
	}

	list(materialGetArgs: Args.MaterialGet) {
		return this.queryClient.makeQuery({
			queryKey: [this.api.endpoints.materialGet, materialGetArgs],
			queryFn: () => this.api.materialGet(materialGetArgs),
		});
	}

	create(materialGetArgs: Args.MaterialGet, materialPostMutArgs: MutArgs<Models.MaterialPost>) {
		const queryKey = [this.api.endpoints.materialGet, materialGetArgs];
		const defaultData = this.listDefaultData;
		return this.queryClient.makeOptimisticMutation<Models.MaterialPost>({
			mutationFn: this.api.materialPost,
			...materialPostMutArgs,
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
