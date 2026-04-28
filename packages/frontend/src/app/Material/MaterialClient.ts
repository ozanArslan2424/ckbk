import type { CorpusApi, Models, Args } from "@/lib/CorpusApi";
import { Entities } from "@/lib/CorpusApi";
import type { MutArgs, QueryClient } from "@/lib/QueryClient";

export class MaterialClient {
	constructor(
		private readonly api: CorpusApi,
		private readonly queryClient: QueryClient,
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

	list(args: Args.MaterialGet) {
		return this.queryClient.makeQuery({
			queryKey: [this.api.endpoints.materialGet, args],
			queryFn: async () => this.api.materialGet(args),
		});
	}

	create(args: Args.MaterialGet, opts: MutArgs<Models.MaterialPost>) {
		const q = this.list(args);

		return this.queryClient.makeOptimisticMutation<Models.MaterialPost>({
			mutationFn: this.api.materialPost,
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
}
