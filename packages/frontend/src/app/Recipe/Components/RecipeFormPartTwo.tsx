import { PlusIcon } from "lucide-react";

import type { useCookbookForm } from "@/app/Cookbook/useCookbookForm";
import { IngredientFormField } from "@/app/Recipe/Components/IngredientFormField";
import { useCardDeckContext } from "@/components/cards/CardDeck";
import { FormCard } from "@/components/form/FormCard";
import { Tooltip } from "@/components/ui/tooltip";
import { useCommonLocale } from "@/hooks/useCommonLocale";
import { useLocale } from "@/hooks/useLocale";
import { repeat } from "@/lib/utils";

type IngredientFormProps = {
	form: ReturnType<typeof useCookbookForm>;
};

export function RecipeFormPartTwo({ form }: IngredientFormProps) {
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
					{form.ingredientCount}
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
								disabled={form.ingredients.length < 1 || form.ingredientAddDisabled}
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
			{repeat(form.ingredientCount).map((i) => (
				<IngredientFormField
					key={i}
					ingredient={form.ingredients[i]}
					usedIngredients={form.ingredients.filter((_, idx) => idx !== i)}
					onChange={(patch) => form.handlePatchIngredient(i, patch)}
				/>
			))}

			<button
				type="button"
				className="secondary"
				onClick={form.handleAddIngredient}
				disabled={form.ingredientAddDisabled}
			>
				<PlusIcon />
				{txt.addIngredient}
			</button>
		</FormCard>
	);
}
