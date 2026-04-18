import type { Args, CorpusApi, Models } from "@/Api/CorpusApi";
import type { QueryClient } from "@/Query/QueryClient";
import type { MakeMutArgs } from "@/Query/QueryTypes";

export class MeasurementClient {
	constructor(
		private readonly query: QueryClient,
		private readonly api: CorpusApi,
	) {}

	create(args: MakeMutArgs<Models.MeasurementPost>) {
		return this.query.makeMutation<Models.MeasurementPost>({
			mutationFn: (vars) => this.api.measurementPost(vars),
			...args,
		});
	}

	list(args: Args.MeasurementGet) {
		return this.query.makeQuery({
			queryKey: [this.api.endpoints.measurementGet],
			queryFn: () => this.api.measurementGet(args),
		});
	}
}
