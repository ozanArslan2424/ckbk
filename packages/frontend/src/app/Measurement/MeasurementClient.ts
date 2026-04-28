import type { CorpusApi, Models, Args } from "@/lib/CorpusApi";
import { Entities } from "@/lib/CorpusApi";
import type { MutArgs, QueryClient } from "@/lib/QueryClient";

export class MeasurementClient {
	constructor(
		private readonly api: CorpusApi,
		private readonly queryClient: QueryClient,
	) {}

	private readonly listDefaultData: Models.MeasurementGet["response"] = [];
	private createPlaceholder(partial?: Partial<Entities.Measurement>) {
		return new Entities.Measurement({
			id: partial?.id ?? -1,
			title: partial?.title ?? "",
			description: partial?.description ?? "",
			updatedAt: new Date().toISOString(),
			createdAt: new Date().toISOString(),
		});
	}

	list(args: Args.MeasurementGet) {
		return this.queryClient.makeQuery({
			queryKey: [this.api.endpoints.measurementGet, args],
			queryFn: async () => this.api.measurementGet(args),
		});
	}

	create(args: Args.MeasurementGet, opts: MutArgs<Models.MeasurementPost>) {
		const q = this.list(args);

		return this.queryClient.makeOptimisticMutation<Models.MeasurementPost>({
			mutationFn: this.api.measurementPost,
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
