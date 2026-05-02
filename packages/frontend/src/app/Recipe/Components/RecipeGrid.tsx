import type { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { useMemo } from "react";

import { RecipeCard } from "@/app/Recipe/Components/RecipeCard";
import { RecipeCardSkeleton } from "@/app/Recipe/Components/RecipeCardSkeleton";
import { ErrorCard } from "@/components/cards/ErrorCard";
import { ScrollLoaderCard } from "@/components/cards/ScrollLoaderCard";
import type { Entities, Models } from "@/lib/CorpusApi";
import type { Events } from "@/lib/Events";
import { repeat } from "@/lib/utils";
import { useCommonLocale } from "@/locale/useCommonLocale";

type Props = {
	query: UseInfiniteQueryResult<InfiniteData<Models.RecipeGet["response"]>>;
	onClickLikeFactory: Events.Factory<Events.ClickEvent, [Entities.Recipe]>;
	onClickViewFactory: Events.Factory<Events.ClickEvent<HTMLDivElement>, [Entities.Recipe]>;
	onClickUpdateFactory: Events.Factory<Events.ClickEvent, [Entities.Recipe]>;
};

export function RecipeGrid(props: Props) {
	const { txt } = useCommonLocale();

	const recipes = useMemo(
		() => props.query.data?.pages.flatMap((r) => r.data) ?? [],
		[props.query.data],
	);

	if (props.query.error) {
		return <ErrorCard error={props.query.error} />;
	}

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
			{props.query.isPending ? (
				repeat(4).map((i) => <RecipeCardSkeleton key={i} />)
			) : recipes.length === 0 ? (
				<p className="text-muted-foreground font-semibold">{txt.noResults}</p>
			) : (
				recipes.map((r) => (
					<RecipeCard
						key={r.id}
						recipe={r}
						onClickLikeFactory={props.onClickLikeFactory}
						onClickUpdateFactory={props.onClickUpdateFactory}
						onClickViewFactory={props.onClickViewFactory}
					/>
				))
			)}
			<ScrollLoaderCard className="col-span-1 md:col-span-2" query={props.query} />
		</div>
	);
}
