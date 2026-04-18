import type { Entities, Models } from "@/Api/CorpusApi";
import { Dialog } from "@/Components/modals/dialog";
import type { ModalState } from "@/Hooks/useModal";
import { useLocale } from "@/lib/Locale/useLocale";
import { cn } from "@/lib/utils";
import type { RecipeDetails } from "@/Types/RecipeDetails";

type RecipeDetailsModalProps = {
	modal: ModalState<RecipeDetails>;
};

export function RecipeDetailsModal({ modal }: RecipeDetailsModalProps) {
	if (!modal.data) return null;

	return (
		<Dialog
			{...modal}
			title={modal.data.recipe.title}
			description={modal.data.recipe.description}
			showCloseButton
			className="w-full sm:max-w-6xl"
		>
			<div className="grid min-h-96 w-full grid-cols-1 overflow-y-auto md:grid-cols-3">
				{/* Column 1 — Details */}
				<div className="col-span-1">
					<DetailsColumn recipe={modal.data.recipe} className="p-6" />
				</div>

				{/* Column 2 — Steps */}
				<div className="col-span-1 border-x-0 border-t border-b md:border-x md:border-t-0 md:border-b-0">
					<StepsColumn steps={modal.data.steps} className="p-6" />
				</div>

				{/* Column 3 — Ingredients */}
				<div className="col-span-1">
					<IngredientsColumn ingredients={modal.data.ingredients} className="p-6" />
				</div>
			</div>
		</Dialog>
	);
}

const DetailsColumn = ({ recipe, className }: { recipe: Entities.Recipe; className: string }) => {
	const { timestamp } = useLocale();
	const updatedAt = timestamp(recipe.updatedAt).dateTimeShort;

	return (
		<div className={cn("flex flex-col overflow-y-auto", className)}>
			<div className="bg-muted relative aspect-square overflow-hidden rounded-t-lg md:rounded-lg">
				{recipe.image ? (
					<img
						src={recipe.image}
						alt={recipe.title}
						className="h-full w-full rounded-md object-cover"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center">
						<svg
							className="text-muted-foreground/20 size-12"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1"
						>
							<rect x="3" y="3" width="18" height="18" rx="2" />
							<circle cx="8.5" cy="8.5" r="1.5" />
							<path d="m21 15-5-5L5 21" />
						</svg>
					</div>
				)}
				<span className="bg-primary text-primary-foreground absolute top-2 left-2 rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wide uppercase">
					Recipe
				</span>
			</div>
			<div className="flex flex-1 flex-col gap-3 p-5">
				<div>
					<h2 className="text-base font-semibold">{recipe.title}</h2>
					<p className="text-muted-foreground mt-1 text-sm leading-relaxed">{recipe.description}</p>
				</div>
				<p className="text-muted-foreground mt-auto text-xs">Updated {updatedAt}</p>
			</div>
		</div>
	);
};

const StepsColumn = ({
	steps,
	className,
}: {
	steps: Models.StepByRecipeRecipeIdGet["response"];
	className: string;
}) => (
	<div className={cn("flex flex-col overflow-y-auto", className)}>
		{steps.length > 0 ? (
			<section>
				<h3 className="text-muted-foreground mb-3 text-xs font-semibold tracking-widest uppercase">
					Steps
				</h3>
				<ol className="flex flex-col gap-4">
					{steps.map((step) => (
						<li key={step.id} className="flex gap-3 text-sm">
							<span className="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
								{step.order}
							</span>
							<p className="pt-0.5 leading-relaxed">{step.body}</p>
						</li>
					))}
				</ol>
			</section>
		) : (
			<div className="text-muted-foreground flex h-full items-center justify-center text-sm">
				No steps available
			</div>
		)}
	</div>
);

const IngredientsColumn = ({
	ingredients,
	className,
}: {
	ingredients: Models.IngredientByRecipeRecipeIdGet["response"];
	className: string;
}) => (
	<div className={cn("flex flex-col overflow-y-auto", className)}>
		{ingredients.length > 0 ? (
			<section>
				<h3 className="text-muted-foreground mb-3 text-xs font-semibold tracking-widest uppercase">
					Ingredients
				</h3>
				<ul className="flex flex-col gap-1.5">
					{ingredients.map((ing) => (
						<li
							key={ing.id}
							className="bg-muted flex items-center justify-between rounded-md px-3 py-2 text-sm"
						>
							<span className="font-semibold">{ing.material}</span>
							<span className="text-muted-foreground">
								{ing.quantity} {ing.measurement}
							</span>
						</li>
					))}
				</ul>
			</section>
		) : (
			<div className="text-muted-foreground flex h-full items-center justify-center text-sm">
				No ingredients available
			</div>
		)}
	</div>
);
