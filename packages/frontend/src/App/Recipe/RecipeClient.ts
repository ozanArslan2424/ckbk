import type { Args, CorpusApi, Models } from "@/lib/CorpusApi";
import type { QueryClient, MutArgs } from "@/lib/QueryClient";

export class RecipeClient {
	constructor(
		private readonly queryClient: QueryClient,
		private readonly api: CorpusApi,
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
			queryFn: ({ pageParam }) =>
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
			queryFn: () => this.api.recipePopularGet(args),
		});
	}

	create(recipeGetArgs: Args.RecipeGet, args: MutArgs<Models.RecipePost>) {
		const queryKey = [this.api.endpoints.recipeGet, recipeGetArgs];

		return this.queryClient.makeMutation<Models.RecipePost>({
			mutationFn: this.api.recipePost,
			...args,
			onSuccess: (res, ...rest) => {
				this.queryClient.updateInfiniteQueryData(
					queryKey,
					this.listDefaultData,
					(page) => page.data.some((r) => r.id === res.id),
					(prev) => {
						return {
							...prev,
							totalPages: Math.ceil((prev.totalCount + 1) / prev.currentLimit),
							totalCount: prev.totalCount + 1,
							data: [res, ...prev.data],
						};
					},
				);
				args.onSuccess?.(res, ...rest);
			},
		});
	}

	update(recipeGetArgs: Args.RecipeGet, args: MutArgs<Models.RecipeIdPut>) {
		const queryKey = [this.api.endpoints.recipeGet, recipeGetArgs];

		return this.queryClient.makeMutation<Models.RecipeIdPut>({
			mutationFn: this.api.recipeIdPut,
			...args,
			onSuccess: (res, ...rest) => {
				this.queryClient.updateInfiniteQueryData(
					queryKey,
					this.listDefaultData,
					(page) => page.data.some((r) => r.id === res.id),
					(prev) => {
						return {
							...prev,
							data: prev.data.map((r) => (r.id === res.id ? res : r)),
						};
					},
				);
				const params = { id: res.id.toString() };
				this.queryClient.invalidateAll([
					this.api.endpoints.ingredientByRecipeIdGet(params),
					this.api.endpoints.stepByRecipeIdGet(params),
				]);
				args.onSuccess?.(res, ...rest);
			},
		});
	}

	like(recipeGetArgs: Args.RecipeGet, args: MutArgs<Models.RecipeLikePost>) {
		const queryKey = [this.api.endpoints.recipeGet, recipeGetArgs];

		return this.queryClient.makeMutation<Models.RecipeLikePost, () => void>({
			mutationFn: (vars) => this.api.recipeLikePost(vars),
			...args,
			onMutate: (vars, ctx) => {
				args.onMutate?.(vars, ctx);
				return this.queryClient.updateInfiniteQueryData(
					queryKey,
					this.listDefaultData,
					(page) => page.data.some((r) => r.id === vars.body?.id),
					(prev) => ({
						...prev,
						data: prev.data.map((recipe) => {
							if (recipe.id === vars.body?.id) {
								const isLiked = vars.body.isLiked;
								const prevLikeCount = recipe.likeCount ?? 0;
								const likeCount = isLiked ? prevLikeCount + 1 : prevLikeCount - 1;
								return { ...recipe, isLiked, likeCount };
							}
							return recipe;
						}),
					}),
				);
			},
			onError: (err, vars, revert, ctx) => {
				revert?.();
				args.onError?.(err, vars, revert, ctx);
			},
		});
	}
}
