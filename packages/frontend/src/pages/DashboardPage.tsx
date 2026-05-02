import { useInfiniteQuery, useMutation } from "@tanstack/react-query";

import { useAppContext } from "@/app/AppContext";
import { Sidebar } from "@/app/Profile/Components/Sidebar";
import { RecipeCreateModal } from "@/app/Recipe/Components/RecipeCreateModal";
import { RecipeDetailsModal } from "@/app/Recipe/Components/RecipeDetailsModal";
import { RecipeGrid } from "@/app/Recipe/Components/RecipeGrid";
import { RecipeListFilters } from "@/app/Recipe/Components/RecipeListFilters";
import { RecipeUpdateModal } from "@/app/Recipe/Components/RecipeUpdateModal";
import { useRecipeGetArgs } from "@/app/Recipe/useRecipeGetArgs";
import { PageContent } from "@/components/layout/PageContent";
import { useModal } from "@/hooks/useModal";
import type { Args, Entities } from "@/lib/CorpusApi";
import { Events } from "@/lib/Events";
import { useLocale } from "@/locale/useLocale";

export function DashboardPage() {
	const { queryClient, cookbookClient, recipeClient, profileClient } = useAppContext();
	const { recipeGetArgs, updateSearchParams } = useRecipeGetArgs();
	const { txt } = useLocale("dashboard", {
		title: recipeGetArgs.search.owner === "me" ? ["yourRecipes"] : ["recentRecipes"],
	});

	const query = useInfiniteQuery(recipeClient.list(recipeGetArgs));
	const likeMut = useMutation(
		recipeClient.like(recipeGetArgs, {
			onMutate: (vars) => {
				profileClient.updateLikeCount(vars.body?.isLiked ? "increase" : "decrease");
			},
		}),
	);

	const createModal = useModal();
	const detailsModal = useModal<Entities.Cookbook>();
	const updateModal = useModal<Entities.Cookbook>();

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

	const handleChangeIsLiked = (value: Args.RecipeGet["search"]["isLiked"]) => {
		updateSearchParams({ isLiked: value });
	};
	const onClickViewFactory = Events.click<[Entities.Recipe], HTMLDivElement>(async (_, recipe) => {
		const params = { id: recipe.id };
		const entry = await queryClient.ensureQueryData(cookbookClient.get({ params }));
		detailsModal.handleOpen(entry);
	});

	const onClickUpdateFactory = Events.click<[Entities.Recipe]>(async (e, recipe) => {
		e.stopPropagation();
		const params = { id: recipe.id };
		const entry = await queryClient.ensureQueryData(cookbookClient.get({ params }));
		updateModal.handleOpen(entry);
	});

	const onClickLikeFactory = Events.click<[Entities.Recipe]>((e, recipe) => {
		e.preventDefault();
		e.stopPropagation();
		likeMut.mutate({ body: { id: recipe.id, isLiked: !recipe.isLiked } });
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
						onChangeIsLiked={handleChangeIsLiked}
					/>

					<div className="h-1" />

					<RecipeGrid
						query={query}
						onClickLikeFactory={onClickLikeFactory}
						onClickUpdateFactory={onClickUpdateFactory}
						onClickViewFactory={onClickViewFactory}
					/>
				</section>
			</main>
		</PageContent>
	);
}
