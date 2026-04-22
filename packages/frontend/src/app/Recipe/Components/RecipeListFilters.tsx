import { useMemo } from "react";

import { useRecipeGetArgs } from "@/app/Recipe/Hooks/useRecipeGetArgs";
import { FilterSearch } from "@/components/FilterSearch";
import { FilterSelect } from "@/components/FilterSelect";
import { FilterToggle } from "@/components/FilterToggle";
import { useCommonLocale } from "@/hooks/useCommonLocale";
import { useLocale } from "@/hooks/useLocale";
import type { Args } from "@/lib/CorpusApi";
import { Help } from "@/lib/Help";

type Props = {
	onChangeSortBy: (value: Args.RecipeGet["search"]["sortBy"] | null) => void;
	onChangeSortOrder: (value: Args.RecipeGet["search"]["sortOrder"] | null) => void;
	onChangeSearch: (value: string) => void;
	onChangeMine: (value: boolean) => void;
};

export function RecipeListFilters(props: Props) {
	const { txt: txtCommon } = useCommonLocale();
	const { t, txt } = useLocale("app", {
		ownerFilterLabel: ["ownerFilter.label"],
		ownerFilterInnerText: ["ownerFilter.innerText"],
	});
	const { recipeGetArgs } = useRecipeGetArgs();

	const KEYS = ["createdAt", "title", "likes", "steps"] as const;

	const SORT_BY_OPTIONS = KEYS.map((key) => ({
		value: key,
		label: t(`sortBy.${key}`),
	}));

	const SORT_ORDER_OPTIONS = useMemo(() => {
		const key = recipeGetArgs.search.sortBy ?? "default";
		return [
			{ label: t(`sortOrder.${key}.desc`), value: "desc" as const },
			{ label: t(`sortOrder.${key}.asc`), value: "asc" as const },
		];
	}, [recipeGetArgs.search]);

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

			<FilterToggle
				label={txt.ownerFilterLabel}
				innerText={txt.ownerFilterInnerText}
				value={Help.toBoolean(recipeGetArgs.search.mine)}
				onChange={props.onChangeMine}
			/>
		</div>
	);
}
