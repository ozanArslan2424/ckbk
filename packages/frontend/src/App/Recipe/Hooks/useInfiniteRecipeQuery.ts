import type { Args } from "@/Api/CorpusApi";
import { useAppContext } from "@/App/AppContext";
import { useInfiniteScrollQuery } from "@/Hooks/useInfiniteScroll";

export function useInfiniteRecipeQuery(listArgs: Args.RecipeGet) {
	const { api } = useAppContext();

	return useInfiniteScrollQuery({
		queryKey: [api.endpoints.recipeGet, listArgs],
		queryFn: ({ pageParam }) =>
			api.recipeGet({
				...listArgs,
				search: { ...listArgs.search, page: pageParam.toString() },
			}),
		initialPageParam: 1,
		getNextPageParam: (res) => (res.totalPages > res.currentPage ? res.currentPage + 1 : undefined),
		select: (data) => ({ ...data, recipes: data.pages.flatMap((r) => r.data) }),
	});
}
