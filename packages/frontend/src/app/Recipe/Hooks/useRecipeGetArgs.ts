import {
	useQueryStates,
	parseAsString,
	parseAsArrayOf,
	parseAsStringEnum,
	parseAsBoolean,
	parseAsInteger,
} from "nuqs";
import { useCallback, useMemo } from "react";

import type { Args } from "@/lib/CorpusApi";
import type { Help } from "@/lib/Help";

type UseRecipeGetArgsReturn = {
	recipeGetArgs: { search: Required<Args.RecipeGet["search"]> };
	updateSearchParams: (patch: Partial<Help.Nullable<Args.RecipeGet["search"]>>) => void;
};

export function useRecipeGetArgs(): UseRecipeGetArgsReturn {
	const [searchParams, setSearchParams] = useQueryStates({
		page: parseAsInteger.withDefault(1),
		limit: parseAsInteger.withDefault(12),
		mine: parseAsBoolean.withDefault(false),
		materialIds: parseAsArrayOf(parseAsInteger).withDefault([]),
		sortBy: parseAsStringEnum(["title", "createdAt", "likes", "steps"]).withDefault("createdAt"),
		sortOrder: parseAsStringEnum(["asc", "desc"]).withDefault("desc"),
		search: parseAsString.withDefault(""),
	});

	const recipeGetArgs = useMemo(
		() => ({
			search: searchParams,
		}),
		[searchParams],
	);

	const updateSearchParams = useCallback(
		(patch: Partial<Help.Nullable<Args.RecipeGet["search"]>>) => {
			setSearchParams((prev) => ({
				...prev,
				...patch,
			}));
		},
		[],
	);

	return { recipeGetArgs, updateSearchParams };
}
