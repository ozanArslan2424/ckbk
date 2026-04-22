import { useAppContext } from "@/app/AppContext";
import { Sidebar } from "@/app/Components/Sidebar";
import { RecipeCreateModal } from "@/app/Recipe/Components/RecipeCreateModal";
import { RecipeDetailsModal } from "@/app/Recipe/Components/RecipeDetailsModal";
import { RecipeGrid } from "@/app/Recipe/Components/RecipeGrid";
import { RecipeListFilters } from "@/app/Recipe/Components/RecipeListFilters";
import { RecipeUpdateModal } from "@/app/Recipe/Components/RecipeUpdateModal";
import { useRecipeGetArgs } from "@/app/Recipe/Hooks/useRecipeGetArgs";
import type { RecipeDetails } from "@/app/Recipe/Types/RecipeDetails";
import { PageContent } from "@/components/layout/PageContent";
import { useLocale } from "@/hooks/useLocale";
import { useModal } from "@/hooks/useModal";
import type { Args, Entities } from "@/lib/CorpusApi";
import { Events } from "@/lib/Events";

export function DashboardPage() {
	const { ingredientClient, stepClient, queryClient } = useAppContext();
	const { recipeGetArgs, updateSearchParams } = useRecipeGetArgs();
	const { txt } = useLocale("dashboard", {
		title: recipeGetArgs.search.owner === "me" ? ["yourRecipes"] : ["recentRecipes"],
	});

	const createModal = useModal();
	const detailsModal = useModal<RecipeDetails>();
	const updateModal = useModal<RecipeDetails>();

	const onClickCreateFactory = Events.click(() => {
		createModal.onOpenChange(true);
	});

	const handleChangeSortBy = (value: Args.RecipeGet["search"]["sortBy"] | null) => {
		updateSearchParams({ sortBy: value });
	};

	const handleChangeSortOrder = (value: Args.RecipeGet["search"]["sortOrder"] | null) => {
		updateSearchParams({ sortOrder: value });
	};

	const handleChangeSearch = (value: string) => {
		updateSearchParams({ search: value === "" ? null : value });
	};

	const handleChangeOwner = (value: Args.RecipeGet["search"]["owner"] | null) => {
		updateSearchParams({ owner: value });
	};

	const onClickViewFactory = Events.click<[Entities.Recipe], HTMLDivElement>(async (_, recipe) => {
		const params = { id: recipe.id.toString() };
		const ingredients = await queryClient.ensureQueryData(
			ingredientClient.listByRecipeId({ params }),
		);
		const steps = await queryClient.ensureQueryData(stepClient.listByRecipeId({ params }));
		detailsModal.handleOpen({ recipe, steps, ingredients });
	});

	const onClickUpdateFactory = Events.click<[Entities.Recipe]>(async (e, recipe) => {
		e.stopPropagation();
		const params = { id: recipe.id.toString() };
		const ingredients = await queryClient.ensureQueryData(
			ingredientClient.listByRecipeId({ params }),
		);
		const steps = await queryClient.ensureQueryData(stepClient.listByRecipeId({ params }));
		updateModal.handleOpen({ recipe, steps, ingredients });
	});

	return (
		<PageContent>
			<RecipeDetailsModal modal={detailsModal} onClickUpdateFactory={onClickUpdateFactory} />
			<RecipeCreateModal modal={createModal} />
			<RecipeUpdateModal modal={updateModal} />

			<main className="grid grid-cols-1 gap-8 lg:grid-cols-4">
				<Sidebar onClickCreateFactory={onClickCreateFactory} />

				<section className="flex flex-col gap-2 lg:col-span-3">
					<h2 className="text-foreground text-2xl font-black tracking-tight">{txt.title}</h2>

					<RecipeListFilters
						onChangeSortBy={handleChangeSortBy}
						onChangeSortOrder={handleChangeSortOrder}
						onChangeSearch={handleChangeSearch}
						onChangeOwner={handleChangeOwner}
					/>

					<div className="h-1" />

					<RecipeGrid
						onClickUpdateFactory={onClickUpdateFactory}
						onClickViewFactory={onClickViewFactory}
					/>
				</section>
			</main>
		</PageContent>
	);
}
