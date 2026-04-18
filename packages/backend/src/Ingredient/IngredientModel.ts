import { X } from "@ozanarslan/corpus";
import { type } from "arktype";

import { IngredientEntity } from "@/Ingredient/IngredientEntity";

export type IngredientType = X.InferModel<typeof IngredientModel>;

export class IngredientModel {
	static create = {
		body: IngredientEntity.schema.pick("quantity", "materialId", "measurementId").and({
			recipeId: "number",
		}),
		response: IngredientEntity.schema,
	};

	static listByRecipe = {
		params: type({ recipeId: type("string").pipe(Number) }),
		response: IngredientEntity.schema
			.and({
				material: "string",
				measurement: "string",
			})
			.array(),
	};
}
