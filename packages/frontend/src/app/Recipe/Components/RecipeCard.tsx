import { HeartIcon, LockIcon, PencilIcon } from "lucide-react";

import { useAppContext } from "@/app/AppContext";
import { useDate } from "@/hooks/useDate";
import type { Entities } from "@/lib/CorpusApi";
import { Events } from "@/lib/Events";
import { cn } from "@/lib/utils";
import { useLocale } from "@/locale/useLocale";

type RecipeCardProps = {
	recipe: Entities.Recipe;
	onClickLikeFactory: Events.Factory<Events.ClickEvent, [Entities.Recipe]>;
	onClickViewFactory: Events.Factory<Events.ClickEvent<HTMLDivElement>, [Entities.Recipe]>;
	onClickUpdateFactory: Events.Factory<Events.ClickEvent, [Entities.Recipe]>;
};

export function RecipeCard(props: RecipeCardProps) {
	const { store } = useAppContext();
	const { timestamp } = useDate();
	const { txt } = useLocale("app", {
		yourRecipe: ["yourRecipe"],
		private: ["privateRecipe"],
		update: ["update"],
		updatedAt: ["updatedAt", { date: timestamp(props.recipe.updatedAt).shortDate }],
	});
	const recipe = {
		...props.recipe,
		likeCount: props.recipe.likeCount ?? 0,
		isLiked: props.recipe.isLiked ?? false,
		isOwner: store.get("auth")?.id === props.recipe.profileId,
	};
	const handleClickLike = props.onClickLikeFactory(recipe);
	const handleClickUpdate = props.onClickUpdateFactory(recipe);
	const handleClickView = props.onClickViewFactory(recipe);

	return (
		<div className="card group hover:border-primary relative cursor-pointer transition-all duration-300">
			{recipe.isOwner && (
				<div className="absolute top-2 left-2 z-20 flex items-center gap-2">
					<div className="bg-accent text-accent-foreground flex items-center justify-center rounded-md px-2.5 py-1.5 text-xs font-semibold tracking-tight">
						{txt.yourRecipe}
					</div>
					{!recipe.isPublic && (
						<div className="bg-secondary text-secondary-foreground flex items-center justify-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-semibold tracking-tight">
							<LockIcon className="size-3" />
							{txt.private}
						</div>
					)}
				</div>
			)}
			<div className="absolute top-2 right-2 z-20 flex items-center gap-2">
				{recipe.isOwner && (
					<button type="button" onClick={handleClickUpdate} className="secondary sm">
						<span className="text-xs font-semibold">{txt.update}</span>
						<PencilIcon className="size-3!" />
					</button>
				)}
				<button type="button" onClick={handleClickLike} className="sm secondary">
					{recipe.likeCount > 0 && (
						<span className="text-xs font-semibold tabular-nums">{recipe.likeCount}</span>
					)}
					<HeartIcon
						className={cn(
							"size-4! transition-colors",
							recipe.isLiked ? "fill-current" : "stroke-current opacity-70 group-hover:opacity-100",
						)}
					/>
				</button>
			</div>
			<div onClick={handleClickView}>
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
					<p className="line-clamp-2 min-h-10 text-sm opacity-80">{recipe.description}</p>
				</article>
				<footer className="flex items-center justify-between">
					<span className="text-muted-foreground font-mono text-xs">{txt.updatedAt}</span>
				</footer>
			</div>
		</div>
	);
}
