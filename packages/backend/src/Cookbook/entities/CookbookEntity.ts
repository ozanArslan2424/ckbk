import { C } from "@ozanarslan/corpus";

import { IngredientEntity } from "@/Ingredient/entities/IngredientEntity";
import { RecipeEntity } from "@/Recipe/entities/RecipeEntity";
import { StepEntity } from "@/Step/entities/StepEntity";

export class CookbookEntity extends C.Entity({
	name: "Cookbook",
	schema: RecipeEntity.schema.and({
		ingredients: IngredientEntity.schema.array(),
		steps: StepEntity.schema.array(),
	}),
}) {}
