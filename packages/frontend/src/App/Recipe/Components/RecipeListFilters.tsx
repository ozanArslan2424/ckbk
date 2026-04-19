import { useMemo } from "react";

import type { Args } from "@/Api/CorpusApi";
import { useRecipeListArgs } from "@/App/Recipe/Hooks/useRecipeListArgs";
import { FilterSearch } from "@/Components/FilterSearch";
import { FilterSelect } from "@/Components/FilterSelect";
import { FilterToggle } from "@/Components/FilterToggle";
import { Help } from "@/lib/Help";
import { useCommonLocale } from "@/Locale/useCommonLocale";
import { useLocale } from "@/Locale/useLocale";

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
	const { listArgs } = useRecipeListArgs();

	const KEYS = ["createdAt", "title", "likes", "steps"] as const;

	const SORT_BY_OPTIONS = KEYS.map((key) => ({
		value: key,
		label: t(`sortBy.${key}`),
	}));

	const SORT_ORDER_OPTIONS = useMemo(() => {
		const key = listArgs.search.sortBy ?? "default";
		return [
			{ label: t(`sortOrder.${key}.desc`), value: "desc" as const },
			{ label: t(`sortOrder.${key}.asc`), value: "asc" as const },
		];
	}, [listArgs.search]);

	return (
		<div className="flex flex-wrap items-center gap-4 py-2">
			<FilterSearch
				label={txtCommon.search}
				placeholder={txtCommon.searchPlaceholder}
				value={listArgs.search.search}
				onChange={props.onChangeSearch}
			/>

			<FilterSelect
				label={txtCommon.sortBy}
				value={listArgs.search.sortBy}
				onChange={props.onChangeSortBy}
				options={SORT_BY_OPTIONS}
			/>

			<FilterSelect
				label={txtCommon.sortOrder}
				value={listArgs.search.sortOrder}
				onChange={props.onChangeSortOrder}
				options={SORT_ORDER_OPTIONS}
			/>

			<FilterToggle
				label={txt.ownerFilterLabel}
				innerText={txt.ownerFilterInnerText}
				value={Help.toBoolean(listArgs.search.mine)}
				onChange={props.onChangeMine}
			/>
		</div>
	);
}
