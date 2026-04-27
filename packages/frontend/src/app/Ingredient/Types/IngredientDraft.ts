import type { IngredientComplete } from "@/app/Ingredient/Types/IngredientComplete";

export type IngredientDraft = Partial<IngredientComplete> & { id: number };
