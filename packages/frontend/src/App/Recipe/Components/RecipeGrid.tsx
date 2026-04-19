import type { Entities } from "@/Api/CorpusApi";
import { RecipeCard } from "@/App/Recipe/Components/RecipeCard";
import { RecipeCardSkeleton } from "@/App/Recipe/Components/RecipeCardSkeleton";
import { useInfiniteRecipeQuery } from "@/App/Recipe/Hooks/useInfiniteRecipeQuery";
import { ErrorCard } from "@/Components/ErrorCard";
import { InfiniteScrollLoader } from "@/Components/InfiniteScrollLoader";
import type { Events } from "@/lib/events";
import { repeat } from "@/lib/utils";
import { useCommonLocale } from "@/Locale/useCommonLocale";

type Props = {
	query: ReturnType<typeof useInfiniteRecipeQuery>;
	onClickView: Events.Factory<Events.ClickEvent<HTMLDivElement>, [Entities.Recipe]>;
	onClickUpdate: Events.Factory<Events.ClickEvent<HTMLButtonElement>, [Entities.Recipe]>;
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

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
			{props.query.data.recipes.length === 0 ? (
				<p className="text-muted-foreground font-semibold">{txtCommon.noResults}</p>
			) : (
				props.query.data.recipes.map((r) => (
					<RecipeCard
						key={r.id}
						recipe={r}
						onClickUpdate={props.onClickUpdate}
						onClickView={props.onClickView}
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
