import type { Args, CorpusApi, Entities, Models } from "@/Api/CorpusApi";
import type { QueryClient } from "@/Query/QueryClient";
import type { MakeMutArgs } from "@/Query/QueryTypes";

export class RecipeClient {
	constructor(
		private readonly query: QueryClient,
		private readonly api: CorpusApi,
	) {}

	create(args: MakeMutArgs<Models.RecipePost> & { listArgs: Args.RecipeGet }) {
		return this.query.makeMutation<Models.RecipePost>({
			mutationFn: (vars) => this.api.recipePost(vars),
			...args,
			onSuccess: (...rest) => {
				this.query.invalidateAll([this.api.endpoints.recipeGet, args.listArgs]);
				args.onSuccess?.(...rest);
			},
		});
	}

	list(args: Args.RecipeGet) {
		return this.query.makeQuery({
			queryKey: [this.api.endpoints.recipeGet, args],
			queryFn: () => this.api.recipeGet(args),
		});
	}

	listPopular(args: Args.RecipePopularGet) {
		return this.query.makeQuery({
			queryKey: [this.api.endpoints.recipePopularGet, args],
			queryFn: () => this.api.recipePopularGet(args),
		});
	}

	like(args: MakeMutArgs<Models.RecipeLikePost>) {
		return this.query.makeMutation<Models.RecipeLikePost, () => void>({
			mutationFn: (vars) => this.api.recipeLikePost(vars),
			...args,
			onMutate: (vars, ctx) => {
				if (!vars.body) return () => {};

				const rev1 = this.query.updateListData<Entities.Recipe>({
					queryKey: [this.api.endpoints.recipeGet],
					action: "update",
					id: vars.body.id,
					data: { isLiked: vars.body.isLiked },
				});

				const rev2 = this.query.updateListData<Entities.Recipe>({
					queryKey: [this.api.endpoints.recipePopularGet],
					action: "update",
					id: vars.body.id,
					data: { isLiked: vars.body.isLiked },
				});

				args.onMutate?.(vars, ctx);

				return () => {
					rev1();
					rev2();
				};
			},
			onError: (err, vars, revert, ctx) => {
				revert?.();
				args.onError?.(err, vars, revert, ctx);
			},
		});
	}
}
