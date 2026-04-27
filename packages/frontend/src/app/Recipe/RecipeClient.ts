import type { Args, CorpusApi, Entities, Models } from "@/lib/CorpusApi";
import type { QueryClient, MutArgs } from "@/lib/QueryClient";

export class RecipeClient {
	constructor(
		private readonly api: CorpusApi,
		private readonly queryClient: QueryClient,
	) {}

	private readonly listDefaultData: Models.RecipeGet["response"] = {
		totalPages: 1,
		totalCount: 1,
		currentPage: 1,
		currentLimit: 1,
		data: [],
	};

	list(recipeGetArgs: Args.RecipeGet) {
		return this.queryClient.makeInfiniteQuery({
			queryKey: [this.api.endpoints.recipeGet, recipeGetArgs],
			queryFn: async ({ pageParam }) =>
				this.api.recipeGet({
					...recipeGetArgs,
					search: { ...recipeGetArgs.search, page: pageParam },
				}),
			initialPageParam: 1,
			getNextPageParam: (res) =>
				res.totalPages > res.currentPage ? res.currentPage + 1 : undefined,
		});
	}

	listPopular(args: Args.RecipePopularGet) {
		return this.queryClient.makeQuery({
			queryKey: [this.api.endpoints.recipePopularGet, args],
			queryFn: async () => this.api.recipePopularGet(args),
		});
	}

	create(recipeGetArgs: Args.RecipeGet, args: MutArgs<Models.RecipePost>) {
		return this.queryClient.makeMutation<Models.RecipePost>({
			mutationFn: this.api.recipePost,
			...args,
			onSuccess: (res, ...rest) => {
				this.addToList(recipeGetArgs, res);
				args.onSuccess?.(res, ...rest);
			},
		});
	}

	update(recipeGetArgs: Args.RecipeGet, args: MutArgs<Models.RecipeIdPut>) {
		return this.queryClient.makeMutation<Models.RecipeIdPut>({
			mutationFn: this.api.recipeIdPut,
			...args,
			onSuccess: (res, vars, ...rest) => {
				this.updateInList(recipeGetArgs, vars.params.id, () => res);
				args.onSuccess?.(res, vars, ...rest);
			},
		});
	}

	like(recipeGetArgs: Args.RecipeGet, args: MutArgs<Models.RecipeLikePost>) {
		return this.queryClient.makeMutation<Models.RecipeLikePost, () => void>({
			mutationFn: async (vars) => this.api.recipeLikePost(vars),
			...args,
			onMutate: (vars, ctx) => {
				if (!vars.body?.id) return () => {};
				args.onMutate?.(vars, ctx);
				return this.updateInList(recipeGetArgs, vars.body.id, (prev) => {
					const isLiked = vars.body?.isLiked ?? false;
					const prevLikeCount = prev.likeCount ?? 0;
					const likeCount = isLiked ? prevLikeCount + 1 : prevLikeCount - 1;
					return { ...prev, isLiked, likeCount };
				});
			},
			onError: (err, vars, revert, ctx) => {
				revert?.();
				args.onError?.(err, vars, revert, ctx);
			},
		});
	}

	addToList(recipeGetArgs: Args.RecipeGet, recipe: Entities.Recipe) {
		const queryKey = [this.api.endpoints.recipeGet, recipeGetArgs];
		return this.queryClient.updateInfiniteQueryData(
			queryKey,
			this.listDefaultData,
			(page) => page.data.some((r) => r.id === recipe.id),
			(prev) => {
				return {
					...prev,
					totalPages: Math.ceil((prev.totalCount + 1) / prev.currentLimit),
					totalCount: prev.totalCount + 1,
					data: [recipe, ...prev.data],
				};
			},
		);
	}

	updateInList(
		recipeGetArgs: Args.RecipeGet,
		id: Entities.Recipe["id"],
		updater: (prev: Entities.Recipe) => Entities.Recipe,
	) {
		const queryKey = [this.api.endpoints.recipeGet, recipeGetArgs];
		return this.queryClient.updateInfiniteQueryData(
			queryKey,
			this.listDefaultData,
			(page) => page.data.some((r) => r.id === id),
			(prev) => {
				return {
					...prev,
					data: prev.data.map((r) => (r.id === id ? updater(r) : r)),
				};
			},
		);
	}
}
