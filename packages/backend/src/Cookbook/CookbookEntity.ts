import { C } from "@ozanarslan/corpus";

import { IngredientEntity } from "@/Ingredient/IngredientEntity";
import { RecipeEntity } from "@/Recipe/RecipeEntity";
import { StepEntity } from "@/Step/StepEntity";

export class CookbookEntity extends C.Entity({
	name: "Cookbook",
	schema: RecipeEntity.schema.and({
		ingredients: IngredientEntity.schema.array(),
		steps: StepEntity.schema.array(),
	}),
}) {}
