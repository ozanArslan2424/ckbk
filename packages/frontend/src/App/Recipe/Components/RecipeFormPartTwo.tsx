import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";

import { IngredientFormField } from "@/App/Recipe/Components/IngredientFormField";
import { useCardDeckContext } from "@/Components/CardDeck";
import { FormCard } from "@/Components/form/FormCard";
import { Tooltip } from "@/Components/ui/tooltip";
import { useAppContext } from "@/Context/AppContext";
import { repeat } from "@/lib/utils";
import { useCommonLocale } from "@/Locale/useCommonLocale";
import { useLocale } from "@/Locale/useLocale";
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
	const { txt: txtCommon } = useCommonLocale();
	const { txt } = useLocale("app", {
		addIngredient: ["form.ingredient.add"],
		ingredients: ["form.ingredient.title"],
		minIngredientTip: ["form.ingredient.min"],
	});
	const ctx = useCardDeckContext();
	const { materialClient, measurementClient } = useAppContext();
	const materialListQuery = useSuspenseQuery(materialClient.list({}));
	const measurementListQuery = useSuspenseQuery(measurementClient.list({}));
	const [measurementOptions, setMeasurementOptions] = useState(
		measurementListQuery.data.map((m) => ({
			value: m.id.toString(),
			label: m.title,
		})),
	);
	const [materialOptions, setMaterialOptions] = useState(() =>
		materialListQuery.data.map((m) => ({
			value: m.id.toString(),
			label: m.title,
		})),
	);

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
						<button onClick={ctx.onPrev} className="secondary w-max">
							{txtCommon.previous}
						</button>

						<Tooltip tip={txt.minIngredientTip}>
							<button
								disabled={ingredients.length < 1}
								onClick={ctx.onNext}
								className="secondary w-max"
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
					ingredient={ingredients[i]}
					onComplete={onCompleteIngredient}
					materialOptions={materialOptions}
					setMaterialOptions={setMaterialOptions}
					measurementOptions={measurementOptions}
					setMeasurementOptions={setMeasurementOptions}
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
				{txt.addIngredient}
			</button>
		</FormCard>
	);
}
