import { useSuspenseQuery } from "@tanstack/react-query";

import { IngredientFormField } from "@/App/Recipe/Components/IngredientFormField";
import { useCardDeckContext } from "@/Components/CardDeck";
import { FormCard } from "@/Components/form/FormCard";
import { useAppContext } from "@/Context/AppContext";
import { useLocale } from "@/lib/Locale/useLocale";
import { repeat } from "@/lib/utils";
import type { IngredientComplete } from "@/Types/IngredientComplete";

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
	const { t } = useLocale("common");
	const ctx = useCardDeckContext();
	const { materialClient, measurementClient } = useAppContext();
	const materialListQuery = useSuspenseQuery(materialClient.list({}));
	const measurementListQuery = useSuspenseQuery(measurementClient.list({}));

	return (
		<FormCard
			title="Ingredients"
			cornerSlot={
				<span className="bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 text-xs font-medium">
					{ingredientCount}
				</span>
			}
			footer={
				ctx ? (
					<>
						<button onClick={ctx.onPrev} className="secondary w-max">
							{t("previous")}
						</button>

						<button onClick={ctx.onNext} className="secondary w-max">
							{t("next")}
						</button>
					</>
				) : null
			}
		>
			{repeat(ingredientCount).map((i) => (
				<IngredientFormField
					key={i}
					ingredient={ingredients[i]}
					onComplete={onCompleteIngredient}
					materials={materialListQuery.data}
					measurements={measurementListQuery.data}
				/>
			))}

			<button className="secondary" onClick={onAddIngredient} disabled={addDisabled}>
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
				Add Ingredient
			</button>
		</FormCard>
	);
}
