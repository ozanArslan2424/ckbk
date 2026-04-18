import type { Args } from "@/Api/CorpusApi";
import { Sidebar } from "@/App/Components/Sidebar";
import { RecipeCreateModal } from "@/App/Recipe/Components/RecipeCreateModal";
import { RecipeDetailsModal } from "@/App/Recipe/Components/RecipeDetailsModal";
import { RecipeGrid } from "@/App/Recipe/Components/RecipeGrid";
import { RecipeListFilters } from "@/App/Recipe/Components/RecipeListFilters";
import { RecipeUpdateModal } from "@/App/Recipe/Components/RecipeUpdateModal";
import { useInfiniteRecipeQuery } from "@/App/Recipe/Hooks/useInfiniteRecipeQuery";
import { useRecipeListArgs } from "@/App/Recipe/Hooks/useRecipeListArgs";
import { PageContent } from "@/Components/layout/PageContent";
import { useModal } from "@/Hooks/useModal";
import { Events } from "@/lib/events";
import { Help } from "@/lib/Help";
import type { RecipeDetails } from "@/Types/RecipeDetails";

export function DashboardPage() {
	const { listArgs, updateSearchParams: updateSearch } = useRecipeListArgs();
	const recipesQuery = useInfiniteRecipeQuery(listArgs);

	const createModal = useModal();
	const detailsModal = useModal<RecipeDetails>();
	const updateModal = useModal<RecipeDetails>();

	const handleClickCreate = Events.click(() => {
		createModal.onOpenChange(true);
	});

	const handleChangeSortBy = (value: Args.RecipeGet["search"]["sortBy"] | null) => {
		updateSearch({ sortBy: value });
	};

	const handleChangeSortOrder = (value: Args.RecipeGet["search"]["sortOrder"] | null) => {
		updateSearch({ sortOrder: value });
	};

	const handleChangeSearch = (value: string) => {
		updateSearch({ search: value === "" ? null : value });
	};

	const handleChangeMine = (value: boolean) => {
		updateSearch({ mine: Help.toStringBoolean(value) });
	};

	return (
		<PageContent>
			<RecipeDetailsModal modal={detailsModal} />
			<RecipeCreateModal modal={createModal} />
			<RecipeUpdateModal modal={updateModal} />

			<main className="grid grid-cols-1 gap-8 lg:grid-cols-4">
				<Sidebar onClickCreate={handleClickCreate()} />

				<section className="flex flex-col gap-2 lg:col-span-3">
					<h2 className="text-foreground text-2xl font-black tracking-tight">
						{listArgs.search.mine === "true" ? "Your" : "Recent"} Recipes
					</h2>

					<RecipeListFilters
						onChangeSortBy={handleChangeSortBy}
						onChangeSortOrder={handleChangeSortOrder}
						onChangeSearch={handleChangeSearch}
						onChangeMine={handleChangeMine}
					/>

					<div className="h-1" />

					<RecipeGrid query={recipesQuery} detailsModal={detailsModal} updateModal={updateModal} />
				</section>
			</main>
		</PageContent>
	);
}
