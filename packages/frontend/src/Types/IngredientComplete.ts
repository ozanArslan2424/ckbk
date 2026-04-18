import type { Entities } from "@/Api/CorpusApi";

export type IngredientComplete = Required<
	Pick<Entities.Ingredient, "materialId" | "measurementId" | "quantity">
>;
