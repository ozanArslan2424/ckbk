import { RecipeCard } from "@/App/Recipe/Components/RecipeCard";
import { RecipeCardSkeleton } from "@/App/Recipe/Components/RecipeCardSkeleton";
import { useInfiniteRecipeQuery } from "@/App/Recipe/Hooks/useInfiniteRecipeQuery";
import { InfiniteScrollLoader } from "@/Components/InfiniteScrollLoader";
import { ErrorCard } from "@/Components/ui/error-card";
import type { ModalState } from "@/Hooks/useModal";
import { repeat } from "@/lib/utils";
import type { RecipeDetails } from "@/Types/RecipeDetails";

type Props = {
	detailsModal: ModalState<RecipeDetails>;
	updateModal: ModalState<RecipeDetails>;
	query: ReturnType<typeof useInfiniteRecipeQuery>;
};

export function RecipeGrid(props: Props) {
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
				<p className="text-muted-foreground font-semibold">No recipes yet!</p>
			) : (
				props.query.data.recipes.map((r) => (
					<RecipeCard
						key={r.id}
						recipe={r}
						detailsModal={props.detailsModal}
						updateModal={props.updateModal}
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
