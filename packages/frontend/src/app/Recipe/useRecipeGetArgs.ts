import {
	useQueryStates,
	parseAsString,
	parseAsArrayOf,
	parseAsStringEnum,
	parseAsInteger,
	parseAsBoolean,
} from "nuqs";
import { useMemo } from "react";

import type { Args } from "@/lib/CorpusApi";
import type { Help } from "@/lib/Help";

type UseRecipeGetArgsReturn = {
	recipeGetArgs: { search: Required<Args.RecipeGet["search"]> };
	updateSearchParams: (patch: Help.Some<Args.RecipeGet["search"]>) => void;
};

export function useRecipeGetArgs(): UseRecipeGetArgsReturn {
	const [searchParams, setSearchParams] = useQueryStates({
		page: parseAsInteger.withDefault(1),
		limit: parseAsInteger.withDefault(12),
		owner: parseAsStringEnum(["me", "others", "all"]).withDefault("all"),
		materialIds: parseAsArrayOf(parseAsInteger).withDefault([]),
		sortBy: parseAsStringEnum(["title", "createdAt", "likes", "steps"]).withDefault("createdAt"),
		sortOrder: parseAsStringEnum(["asc", "desc"]).withDefault("desc"),
		search: parseAsString.withDefault(""),
		isLiked: parseAsBoolean.withDefault(false),
	});

	const recipeGetArgs = useMemo(
		() => ({
			search: searchParams,
		}),
		[searchParams],
	);

	const updateSearchParams = async (patch: Partial<Help.Nullable<Args.RecipeGet["search"]>>) =>
		setSearchParams((prev) => ({ ...prev, ...patch }));

	return { recipeGetArgs, updateSearchParams };
}
