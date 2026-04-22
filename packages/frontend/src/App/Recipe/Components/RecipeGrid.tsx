import { useMemo } from "react";

import { RecipeCard } from "@/app/Recipe/Components/RecipeCard";
import { RecipeCardSkeleton } from "@/app/Recipe/Components/RecipeCardSkeleton";
import { ErrorCard } from "@/components/ErrorCard";
import { InfiniteScrollLoader } from "@/components/InfiniteScrollLoader";
import { useCommonLocale } from "@/hooks/useCommonLocale";
import type { useInfiniteScrollQuery } from "@/hooks/useInfiniteScroll";
import type { Entities, Models } from "@/lib/CorpusApi";
import type { Events } from "@/lib/Events";
import { repeat } from "@/lib/utils";

type Props = {
	query: ReturnType<typeof useInfiniteScrollQuery<Models.RecipeGet["response"]>>;
	onClickViewFactory: Events.Factory<Events.ClickEvent<HTMLDivElement>, [Entities.Recipe]>;
	onClickUpdateFactory: Events.Factory<Events.ClickEvent<HTMLButtonElement>, [Entities.Recipe]>;
};

export function RecipeGrid(props: Props) {
	const { txt: txtCommon } = useCommonLocale();

	if (props.query.isPending) {
		return (
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				{repeat(4).map((i) => (
					<RecipeCardSkeleton key={i} />
				))}
				<div className="col-span-2">
					<InfiniteScrollLoader
						scrollRef={props.query.scrollRef}
						isFetchingNextPage={props.query.isFetchingNextPage}
					/>
				</div>
			</div>
		);
	}

	if (props.query.error) {
		return <ErrorCard error={props.query.error} />;
	}

	const recipes = useMemo(
		() => props.query.data?.pages.flatMap((r) => r.data) ?? [],
		[props.query.data],
	);

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
			{recipes.length === 0 ? (
				<p className="text-muted-foreground font-semibold">{txtCommon.noResults}</p>
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
				<InfiniteScrollLoader
					scrollRef={props.query.scrollRef}
					isFetchingNextPage={props.query.isFetchingNextPage}
				/>
			</div>
		</div>
	);
}
