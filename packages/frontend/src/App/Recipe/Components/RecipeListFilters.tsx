import { useMemo } from "react";

import type { Args } from "@/Api/CorpusApi";
import { useRecipeListArgs } from "@/App/Recipe/Hooks/useRecipeListArgs";
import { FilterSearch } from "@/Components/FilterSearch";
import { FilterSelect } from "@/Components/FilterSelect";
import { FilterToggle } from "@/Components/FilterToggle";
import { Help } from "@/lib/Help";

type Props = {
	onChangeSortBy: (value: Args.RecipeGet["search"]["sortBy"] | null) => void;
	onChangeSortOrder: (value: Args.RecipeGet["search"]["sortOrder"] | null) => void;
	onChangeSearch: (value: string) => void;
	onChangeMine: (value: boolean) => void;
};

export function RecipeListFilters(props: Props) {
	const { listArgs } = useRecipeListArgs();

	const SORT_BY_OPTIONS = [
		{ value: "createdAt" as const, label: "Date Created" },
		{ value: "title" as const, label: "Title" },
		{ value: "likes" as const, label: "Like Count" },
		{ value: "steps" as const, label: "Step Count" },
	];

	const SORT_ORDER_OPTIONS = useMemo(() => {
		const opts = (desc: string, asc: string) => [
			{ label: desc, value: "desc" as const },
			{ label: asc, value: "asc" as const },
		];

		if (listArgs.search.sortBy === "createdAt") {
			return opts("Newest First", "Oldest First");
		}
		if (listArgs.search.sortBy === "title") {
			return opts("A -> Z", "Z -> A");
		}
		if (listArgs.search.sortBy === "likes") {
			return opts("Most Likes", "Least Likes");
		}

		if (listArgs.search.sortBy === "steps") {
			return opts("Most Steps", "Least Steps");
		}
		return opts("Descending", "Ascending");
	}, [listArgs.search]);

	return (
		<div className="flex flex-wrap items-center gap-4 py-2">
			<FilterSearch
				label="Search"
				placeholder="Search..."
				value={listArgs.search.search}
				onChange={props.onChangeSearch}
			/>

			<FilterSelect
				label="Sort By"
				value={listArgs.search.sortBy}
				onChange={props.onChangeSortBy}
				options={SORT_BY_OPTIONS}
			/>

			<FilterSelect
				label="Order"
				value={listArgs.search.sortOrder || "desc"}
				onChange={props.onChangeSortOrder}
				options={SORT_ORDER_OPTIONS}
			/>

			<FilterToggle
				label="Ownership"
				innerText="Only yours"
				value={Help.toBoolean(listArgs.search.mine)}
				onChange={props.onChangeMine}
			/>
		</div>
	);
}
