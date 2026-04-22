import { useMemo } from "react";

import { useAppContext } from "@/app/AppContext";
import { RecipeCard } from "@/app/Recipe/Components/RecipeCard";
import { RecipeCardSkeleton } from "@/app/Recipe/Components/RecipeCardSkeleton";
import { useRecipeGetArgs } from "@/app/Recipe/Hooks/useRecipeGetArgs";
import { ErrorCard } from "@/components/cards/ErrorCard";
import { ScrollLoaderCard } from "@/components/cards/ScrollLoaderCard";
import { useCommonLocale } from "@/hooks/useCommonLocale";
import { useInfiniteScrollQuery } from "@/hooks/useInfiniteScroll";
import type { Entities } from "@/lib/CorpusApi";
import type { Events } from "@/lib/Events";
import { repeat } from "@/lib/utils";

type Props = {
	onClickViewFactory: Events.Factory<Events.ClickEvent<HTMLDivElement>, [Entities.Recipe]>;
	onClickUpdateFactory: Events.Factory<Events.ClickEvent, [Entities.Recipe]>;
};

export function RecipeGrid(props: Props) {
	const { recipeClient } = useAppContext();
	const { recipeGetArgs } = useRecipeGetArgs();
	const query = useInfiniteScrollQuery(recipeClient.list(recipeGetArgs));
	const { txt } = useCommonLocale();

	const recipes = useMemo(() => query.data?.pages.flatMap((r) => r.data) ?? [], [query.data]);

	if (query.isPending) {
		return (
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				{repeat(4).map((i) => (
					<RecipeCardSkeleton key={i} />
				))}
				<div className="col-span-2">
					<ScrollLoaderCard query={query} />
				</div>
			</div>
		);
	}

	if (query.error) {
		return <ErrorCard error={query.error} />;
	}

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
			{recipes.length === 0 ? (
				<p className="text-muted-foreground font-semibold">{txt.noResults}</p>
			) : (
				recipes.map((r) => (
					<RecipeCard
						key={r.id}
						recipe={r}
						onClickUpdateFactory={props.onClickUpdateFactory}
						onClickViewFactory={props.onClickViewFactory}
					/>
				))
			)}
			<div className="col-span-2">
				<ScrollLoaderCard query={query} />
			</div>
		</div>
	);
}
