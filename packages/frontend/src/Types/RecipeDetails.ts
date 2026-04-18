import type { Entities, Models } from "@/Api/CorpusApi";

export type RecipeDetails = {
	recipe: Entities.Recipe;
	ingredients: Models.IngredientByRecipeRecipeIdGet["response"];
	steps: Models.StepByRecipeRecipeIdGet["response"];
};
