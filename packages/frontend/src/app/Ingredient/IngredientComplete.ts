import type { Entities } from "@/lib/CorpusApi";

export type IngredientComplete = Required<
	Pick<Entities.Ingredient, "id" | "materialId" | "measurementId" | "quantity">
>;

export type IngredientPatch = Partial<IngredientComplete>;

export type IngredientDraft = IngredientPatch & { id: number };

export function isIngredientComplete(i: IngredientDraft): i is IngredientComplete {
	return (
		i.materialId !== undefined &&
		i.measurementId !== undefined &&
		i.quantity !== undefined &&
		Number.isFinite(i.quantity) &&
		i.quantity > 0
	);
}
