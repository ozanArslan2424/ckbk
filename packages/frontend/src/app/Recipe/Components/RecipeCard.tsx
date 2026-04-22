import { useMutation } from "@tanstack/react-query";
import { HeartIcon, PencilIcon } from "lucide-react";

import { useAppContext } from "@/app/AppContext";
import { useRecipeGetArgs } from "@/app/Recipe/Hooks/useRecipeGetArgs";
import { useDate } from "@/hooks/useDate";
import { useLocale } from "@/hooks/useLocale";
import type { Entities } from "@/lib/CorpusApi";
import { Events } from "@/lib/Events";
import { cn } from "@/lib/utils";

type RecipeCardProps = {
	recipe: Entities.Recipe;
	onClickViewFactory: Events.Factory<Events.ClickEvent<HTMLDivElement>, [Entities.Recipe]>;
	onClickUpdateFactory: Events.Factory<Events.ClickEvent<HTMLButtonElement>, [Entities.Recipe]>;
};

export function RecipeCard(props: RecipeCardProps) {
	const { recipeGetArgs } = useRecipeGetArgs();
	const { recipeClient, store } = useAppContext();
	const { timestamp } = useDate();
	const { txt } = useLocale("app", {
		yourRecipe: ["yourRecipe"],
		update: ["update"],
		updatedAt: ["updatedAt", { date: timestamp(props.recipe.updatedAt).short }],
	});

	const likeCount = props.recipe.likeCount ?? 0;
	const isLiked = props.recipe.isLiked ?? false;
	const isOwner = store.get("auth")?.id === props.recipe.profileId;

	const likeMut = useMutation(recipeClient.like(recipeGetArgs, {}));

	const onClickLikeFactory = Events.click<[Entities.Recipe]>((e, recipe) => {
		e.preventDefault();
		e.stopPropagation();
		likeMut.mutate({ body: { id: recipe.id, isLiked: !props.recipe.isLiked } });
	});

	const handleClickLike = onClickLikeFactory(props.recipe);
	const handleClickUpdate = props.onClickUpdateFactory(props.recipe);
	const handleClickView = props.onClickViewFactory(props.recipe);

	return (
		<>
			<div className="relative">
				{isOwner && (
					<div className="absolute top-2 left-2 z-20 flex items-center gap-2">
						<div className="bg-accent text-accent-foreground flex items-center justify-center rounded-md px-2.5 py-1.5 text-xs font-semibold tracking-tight">
							{txt.yourRecipe}
						</div>
					</div>
				)}

				<div className="absolute top-2 right-2 z-20 flex items-center gap-2">
					{isOwner && (
						<button onClick={handleClickUpdate} className="secondary sm">
							<span className="text-xs font-semibold">{txt.update}</span>
							<PencilIcon className="size-3!" />
						</button>
					)}

					<button
						onClick={handleClickLike}
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
					onClick={handleClickView}
					className="card group hover:border-primary cursor-pointer transition-all duration-300"
				>
					<div className="relative h-48 overflow-hidden">
						{props.recipe.image ? (
							<img
								src={props.recipe.image}
								alt={props.recipe.title}
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
						<h2 className="mb-1 truncate">{props.recipe.title}</h2>
						<p className="line-clamp-2 min-h-10 text-sm opacity-80">{props.recipe.description}</p>
					</article>
					<footer className="flex items-center justify-between">
						<span className="text-muted-foreground font-mono text-xs">{txt.updatedAt}</span>
					</footer>
				</div>
			</div>
		</>
	);
}
