import { Entities } from "@/lib/CorpusApi";
import type { Args, CorpusApi, Models } from "@/lib/CorpusApi";
import type { MutArgs, QueryClient } from "@/lib/QueryClient";
import type { Store } from "@/lib/Store";

export class ProfileClient {
	constructor(
		private readonly api: CorpusApi,
		private readonly queryClient: QueryClient,
		private readonly store: Store,
	) {}

	private readonly defaultStats = new Entities.Stats({
		name: "",
		image: null,
		joined: "",
		lastActive: "",
		lastContribution: "",
		contributionCount: 0,
		likeCount: 0,
	});

	get(args: Args.ProfileGet) {
		return this.queryClient.makeQuery({
			queryKey: [this.api.endpoints.profileGet, args],
			queryFn: () => this.api.profileGet(args),
		});
	}

	myStats() {
		const args: Args.ProfileStatsIdGet = { params: { id: this.store.get("auth")?.id ?? -1 } };
		return this.queryClient.makeQuery({
			queryKey: [this.api.endpoints.profileStatsIdGet(args.params), args],
			queryFn: () => this.api.profileStatsIdGet(args),
		});
	}

	stats(args: Args.ProfileStatsIdGet) {
		return this.queryClient.makeQuery({
			queryKey: [this.api.endpoints.profileStatsIdGet(args.params), args],
			queryFn: () => this.api.profileStatsIdGet(args),
		});
	}

	create(args: Args.ProfileGet, opts: MutArgs<Models.ProfilePost>) {
		const q = this.get(args);

		return this.queryClient.makeMutation({
			mutationFn: this.api.profilePost,
			...opts,
			onSuccess: (res, ...rest) => {
				this.queryClient.setQueryData(q.queryKey, res);
				opts.onSuccess?.(res, ...rest);
			},
		});
	}

	addContribution() {
		const q = this.myStats();
		return this.queryClient.updateQueryData(q.queryKey, this.defaultStats, (prev) => ({
			...prev,
			lastContribution: new Date().toISOString(),
			contributionCount: prev.contributionCount + 1,
		}));
	}

	updateLikeCount(act: "increase" | "decrease") {
		const q = this.myStats();
		return this.queryClient.updateQueryData(q.queryKey, this.defaultStats, (prev) => ({
			...prev,
			likeCount: act === "increase" ? prev.likeCount + 1 : prev.likeCount - 1,
		}));
	}
}
