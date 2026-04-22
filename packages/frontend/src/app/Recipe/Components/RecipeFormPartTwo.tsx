import type { IngredientComplete } from "@/app/Ingredient/Types/IngredientComplete";
import { IngredientFormField } from "@/app/Recipe/Components/IngredientFormField";
import { useCardDeckContext } from "@/components/cards/CardDeck";
import { FormCard } from "@/components/form/FormCard";
import { Tooltip } from "@/components/ui/tooltip";
import { useCommonLocale } from "@/hooks/useCommonLocale";
import { useLocale } from "@/hooks/useLocale";
import { repeat } from "@/lib/utils";

type IngredientFormProps = {
	addDisabled: boolean;
	ingredients: IngredientComplete[];
	ingredientCount: number;
	onAddIngredient: () => void;
	onCompleteIngredient: (ingredient: IngredientComplete) => void;
};

export function RecipeFormPartTwo({
	addDisabled,
	ingredients,
	ingredientCount,
	onAddIngredient,
	onCompleteIngredient,
}: IngredientFormProps) {
	const { txt: txtCommon } = useCommonLocale();
	const { txt } = useLocale("app", {
		addIngredient: ["form.ingredient.add"],
		ingredients: ["form.ingredient.title"],
		minIngredientTip: ["form.ingredient.min"],
	});
	const ctx = useCardDeckContext();

	return (
		<FormCard
			title={txt.ingredients}
			cornerSlot={
				<span className="bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 text-xs font-medium">
					{ingredientCount}
				</span>
			}
			footer={
				ctx ? (
					<>
						<button type="button" onClick={ctx.onPrev} className="secondary w-max">
							{txtCommon.previous}
						</button>

						<Tooltip tip={txt.minIngredientTip}>
							<button
								type="button"
								disabled={ingredients.length < 1}
								onClick={ctx.onNext}
								className="w-max"
							>
								{txtCommon.next}
							</button>
						</Tooltip>
					</>
				) : null
			}
		>
			{repeat(ingredientCount).map((i) => (
				<IngredientFormField
					key={i}
					ingredientCount={ingredientCount}
					ingredient={ingredients[i]}
					onComplete={onCompleteIngredient}
				/>
			))}

			<button type="button" className="secondary" onClick={onAddIngredient} disabled={addDisabled}>
				<svg
					className="size-4"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
				>
					<path d="M12 5v14M5 12h14" />
				</svg>
				{txt.addIngredient}
			</button>
		</FormCard>
	);
}
