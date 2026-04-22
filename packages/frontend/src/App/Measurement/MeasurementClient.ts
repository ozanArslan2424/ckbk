import { Entities, type Args, type CorpusApi, type Models } from "@/lib/CorpusApi";
import type { MutArgs, QueryClient } from "@/lib/QueryClient";

export class MeasurementClient {
	constructor(
		private readonly queryClient: QueryClient,
		private readonly api: CorpusApi,
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

	list(measurementGetArgs: Args.MeasurementGet) {
		return this.queryClient.makeQuery({
			queryKey: [this.api.endpoints.measurementGet, measurementGetArgs],
			queryFn: () => this.api.measurementGet(measurementGetArgs),
		});
	}

	create(
		measurementGetArgs: Args.MeasurementGet,
		measurementPostMutArgs: MutArgs<Models.MeasurementPost>,
	) {
		const queryKey = [this.api.endpoints.measurementGet, measurementGetArgs];
		const defaultData = this.listDefaultData;
		return this.queryClient.makeOptimisticMutation<Models.MeasurementPost>({
			mutationFn: this.api.measurementPost,
			...measurementPostMutArgs,
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
