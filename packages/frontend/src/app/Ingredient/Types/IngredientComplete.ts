import type { Entities } from "@/lib/CorpusApi";

export type IngredientComplete = Required<
	Pick<Entities.Ingredient, "id" | "materialId" | "measurementId" | "quantity">
>;
