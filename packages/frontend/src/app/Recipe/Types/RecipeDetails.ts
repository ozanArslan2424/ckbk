import type { Entities, Models } from "@/lib/CorpusApi";

export type RecipeDetails = {
	recipe: Entities.Recipe;
	ingredients: Models.IngredientByRecipeIdGet["response"];
	steps: Models.StepByRecipeIdGet["response"];
};
