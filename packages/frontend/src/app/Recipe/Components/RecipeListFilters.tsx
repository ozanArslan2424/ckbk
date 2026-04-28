import { useMemo } from "react";

import { useRecipeGetArgs } from "@/app/Recipe/useRecipeGetArgs";
import { FilterSearch } from "@/components/FilterSearch";
import { FilterSelect } from "@/components/FilterSelect";
import { useCommonLocale } from "@/hooks/useCommonLocale";
import { useLocale } from "@/hooks/useLocale";
import type { Args } from "@/lib/CorpusApi";

type Props = {
	onChangeSortBy: (value: Args.RecipeGet["search"]["sortBy"] | null) => void;
	onChangeSortOrder: (value: Args.RecipeGet["search"]["sortOrder"] | null) => void;
	onChangeSearch: (value: string) => void;
	onChangeOwner: (value: Args.RecipeGet["search"]["owner"] | null) => void;
};

export function RecipeListFilters(props: Props) {
	const { txt: txtCommon } = useCommonLocale();
	const { t, txt } = useLocale("app", {
		ownerFilterLabel: ["ownerFilter.label"],
		ownerFilterInnerText: ["ownerFilter.innerText"],
	});
	const { recipeGetArgs } = useRecipeGetArgs();

	const SORT_BY_OPTIONS = useMemo(() => {
		const KEYS = ["createdAt", "title", "likes", "steps"] as const;
		return KEYS.map((value) => ({ label: t(`sortBy.${value}`), value }));
	}, [t]);

	const SORT_ORDER_OPTIONS = useMemo(() => {
		const KEYS = ["desc", "asc"] as const;
		return KEYS.map((value) => ({
			label: t(`sortOrder.${recipeGetArgs.search.sortBy}.${value}`),
			value,
		}));
	}, [t, recipeGetArgs.search]);

	const OWNER_OPTIONS = useMemo(() => {
		const KEYS = ["all", "me", "others"] as const;
		return KEYS.map((value) => ({ label: t(`ownerFilter.${value}`), value }));
	}, [t]);

	return (
		<div className="flex flex-wrap items-center gap-4 py-2">
			<FilterSearch
				label={txtCommon.search}
				placeholder={txtCommon.searchPlaceholder}
				value={recipeGetArgs.search.search}
				onChange={props.onChangeSearch}
			/>

			<FilterSelect
				label={txtCommon.sortBy}
				value={recipeGetArgs.search.sortBy}
				onChange={props.onChangeSortBy}
				options={SORT_BY_OPTIONS}
			/>

			<FilterSelect
				label={txtCommon.sortOrder}
				value={recipeGetArgs.search.sortOrder}
				onChange={props.onChangeSortOrder}
				options={SORT_ORDER_OPTIONS}
			/>

			<FilterSelect
				label={txt.ownerFilterLabel}
				value={recipeGetArgs.search.owner}
				onChange={props.onChangeOwner}
				options={OWNER_OPTIONS}
			/>
		</div>
	);
}
