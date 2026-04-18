import { useQueryStates, parseAsString, parseAsArrayOf, parseAsStringEnum } from "nuqs";
import { useCallback, useMemo } from "react";

import type { Args } from "@/Api/CorpusApi";
import type { Help } from "@/lib/Help";

export function useRecipeListArgs() {
	const [searchParams, setSearchParams] = useQueryStates({
		page: parseAsString.withDefault("1"),
		limit: parseAsString.withDefault("12"),
		mine: parseAsString.withDefault("false"),
		materialIds: parseAsArrayOf(parseAsString).withDefault([]),
		sortBy: parseAsStringEnum(["title", "createdAt", "likes", "steps"]).withDefault("createdAt"),
		sortOrder: parseAsStringEnum(["asc", "desc"]).withDefault("desc"),
		search: parseAsString.withDefault(""),
	});

	const listArgs = useMemo(
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

	return { listArgs, updateSearchParams };
}
