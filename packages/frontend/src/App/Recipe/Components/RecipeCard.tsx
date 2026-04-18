import { useMutation } from "@tanstack/react-query";
import { HeartIcon, PencilIcon } from "lucide-react";
import { useState } from "react";

import type { Entities } from "@/Api/CorpusApi";
import { useAppContext } from "@/Context/AppContext";
import { type ModalState } from "@/Hooks/useModal";
import { Events } from "@/lib/events";
import { useLocale } from "@/lib/Locale/useLocale";
import { cn } from "@/lib/utils";
import type { RecipeDetails } from "@/Types/RecipeDetails";

type RecipeCardProps = {
	recipe: Entities.Recipe;
	detailsModal: ModalState<RecipeDetails>;
	updateModal: ModalState<RecipeDetails>;
};

export function RecipeCard({ recipe, detailsModal, updateModal }: RecipeCardProps) {
	const [likeCount, setLikeCount] = useState(recipe.likeCount);
	const [isLiked, setIsLiked] = useState(recipe.isLiked);
	const { recipeClient, ingredientClient, stepClient, store, queryClient } = useAppContext();
	const { timestamp } = useLocale();
	const updatedAt = timestamp(recipe.updatedAt).short;

	const isOwner = store.get("auth")?.id === recipe.profileId;

	const likeMut = useMutation(
		recipeClient.like({
			onError() {
				setIsLiked(false);
				setLikeCount((p) => p - 1);
			},
		}),
	);

	const handleViewClick = Events.click<[Entities.Recipe], HTMLDivElement>(async (_, recipe) => {
		const params = { recipeId: recipe.id.toString() };
		const ingredients = await queryClient.ensureQueryData(
			ingredientClient.listByRecipe({ params }),
		);
		const steps = await queryClient.ensureQueryData(stepClient.listByRecipe({ params }));
		detailsModal.handleOpen({ recipe, steps, ingredients });
	});

	const handleLikeClick = Events.click<[Entities.Recipe]>((e, recipe) => {
		e.stopPropagation();
		likeMut.mutate({ body: { id: recipe.id, isLiked: !isLiked } });
		setIsLiked((p) => !p);
		setLikeCount((p) => (isLiked ? p - 1 : p + 1));
	});

	const handleUpdateClick = Events.click<[Entities.Recipe]>(async (e, recipe) => {
		e.stopPropagation();
		const params = { recipeId: recipe.id.toString() };
		const ingredients = await queryClient.ensureQueryData(
			ingredientClient.listByRecipe({ params }),
		);
		const steps = await queryClient.ensureQueryData(stepClient.listByRecipe({ params }));
		updateModal.handleOpen({ recipe, steps, ingredients });
	});

	return (
		<>
			<div className="relative">
				{isOwner && (
					<div className="absolute top-2 left-2 z-20 flex items-center gap-2">
						<div className="bg-accent text-accent-foreground flex items-center justify-center rounded-md px-2.5 py-1.5 text-xs font-semibold tracking-tight">
							Your Recipe
						</div>
					</div>
				)}

				<div className="absolute top-2 right-2 z-20 flex items-center gap-2">
					{isOwner && (
						<button onClick={handleUpdateClick(recipe)} className="secondary sm">
							<span className="text-xs font-semibold">Update</span>
							<PencilIcon className="size-3!" />
						</button>
					)}

					<button
						onClick={handleLikeClick(recipe)}
						className={cn(
							"unset",
							"flex items-center gap-1 rounded-md px-2.5 py-1.5 transition-colors duration-200",
							isLiked
								? "bg-accent text-accent-foreground"
								: "bg-secondary hover:bg-accent hover:text-accent-foreground",
						)}
					>
						{likeCount > 0 && (
							<span className="text-xs font-semibold tabular-nums">{likeCount}</span>
						)}

						<HeartIcon
							className={cn(
								"size-4! transition-colors",
								isLiked ? "fill-current" : "stroke-current opacity-70 group-hover:opacity-100",
							)}
						/>
					</button>
				</div>

				<div
					onClick={handleViewClick(recipe)}
					className="card group hover:border-primary cursor-pointer transition-all duration-300"
				>
					<div className="relative h-48 overflow-hidden">
						{recipe.image ? (
							<img
								src={recipe.image}
								alt={recipe.title}
								className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
							/>
						) : (
							<div className="bg-muted/30 flex h-full w-full items-center justify-center">
								<svg
									className="text-muted-foreground/25 size-10"
									width="48"
									height="48"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.2"
								>
									<rect x="3" y="3" width="18" height="18" rx="2" />
									<circle cx="8.5" cy="8.5" r="1.5" />
									<path d="m21 15-5-5L5 21" />
								</svg>
							</div>
						)}
					</div>
					<article>
						<h2 className="mb-1 truncate">{recipe.title}</h2>
						{/* Fixed height description area */}
						<p className="line-clamp-2 min-h-10 text-sm opacity-80">{recipe.description}</p>
					</article>
					<footer className="flex items-center justify-between">
						<span className="text-muted-foreground font-mono text-xs">Updated {updatedAt}</span>
					</footer>
				</div>
			</div>
		</>
	);
}
