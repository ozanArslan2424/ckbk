import type { Args, Entities } from "@/Api/CorpusApi";
import { Sidebar } from "@/App/Components/Sidebar";
import { RecipeCreateModal } from "@/App/Recipe/Components/RecipeCreateModal";
import { RecipeDetailsModal } from "@/App/Recipe/Components/RecipeDetailsModal";
import { RecipeGrid } from "@/App/Recipe/Components/RecipeGrid";
import { RecipeListFilters } from "@/App/Recipe/Components/RecipeListFilters";
import { RecipeUpdateModal } from "@/App/Recipe/Components/RecipeUpdateModal";
import { useInfiniteRecipeQuery } from "@/App/Recipe/Hooks/useInfiniteRecipeQuery";
import { useRecipeForm } from "@/App/Recipe/Hooks/useRecipeForm";
import { useRecipeListArgs } from "@/App/Recipe/Hooks/useRecipeListArgs";
import { PageContent } from "@/Components/layout/PageContent";
import { useAppContext } from "@/Context/AppContext";
import { useModal } from "@/Hooks/useModal";
import { Events } from "@/lib/events";
import { Help } from "@/lib/Help";
import { useLocale } from "@/Locale/useLocale";
import type { RecipeDetails } from "@/Types/RecipeDetails";

export function DashboardPage() {
	const { ingredientClient, stepClient, queryClient } = useAppContext();
	const { listArgs, updateSearchParams: updateSearch } = useRecipeListArgs();
	const { txt } = useLocale("dashboard", {
		title: Help.toBoolean(listArgs.search.mine) ? ["yourRecipes"] : ["recentRecipes"],
	});

	const createModal = useModal();
	const detailsModal = useModal<RecipeDetails>();
	const updateModal = useModal<RecipeDetails>();

	const recipesQuery = useInfiniteRecipeQuery(listArgs);
	const recipeForm = useRecipeForm(() => {
		createModal.onOpenChange(false);
		detailsModal.onOpenChange(false);
		updateModal.onOpenChange(false);
	});

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

	const handleClickView = Events.click<[Entities.Recipe], HTMLDivElement>(async (_, recipe) => {
		const params = { recipeId: recipe.id.toString() };
		const ingredients = await queryClient.ensureQueryData(
			ingredientClient.listByRecipe({ params }),
		);
		const steps = await queryClient.ensureQueryData(stepClient.listByRecipe({ params }));
		detailsModal.handleOpen({ recipe, steps, ingredients });
	});

	const handleClickUpdate = Events.click<[Entities.Recipe]>(async (e, recipe) => {
		e.stopPropagation();
		const params = { recipeId: recipe.id.toString() };
		const ingredients = await queryClient.ensureQueryData(
			ingredientClient.listByRecipe({ params }),
		);
		const steps = await queryClient.ensureQueryData(stepClient.listByRecipe({ params }));
		updateModal.handleOpen({ recipe, steps, ingredients });
	});

	return (
		<PageContent>
			<RecipeDetailsModal modal={detailsModal} onClickUpdate={handleClickUpdate} />
			<RecipeCreateModal modal={createModal} form={recipeForm} />
			<RecipeUpdateModal modal={updateModal} form={recipeForm} />

			<main className="grid grid-cols-1 gap-8 lg:grid-cols-4">
				<Sidebar onClickCreate={handleClickCreate()} />

				<section className="flex flex-col gap-2 lg:col-span-3">
					<h2 className="text-foreground text-2xl font-black tracking-tight">{txt.title}</h2>

					<RecipeListFilters
						onChangeSortBy={handleChangeSortBy}
						onChangeSortOrder={handleChangeSortOrder}
						onChangeSearch={handleChangeSearch}
						onChangeMine={handleChangeMine}
					/>

					<div className="h-1" />

					<RecipeGrid
						query={recipesQuery}
						onClickUpdate={handleClickUpdate}
						onClickView={handleClickView}
					/>
				</section>
			</main>
		</PageContent>
	);
}
