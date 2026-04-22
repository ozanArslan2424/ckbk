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

	static update = {
		params: type({ id: type("string").pipe(Number) }),
		body: this.create.body.partial(),
		response: IngredientEntity.schema,
	};

	static listByRecipe = {
		params: type({ id: type("string").pipe(Number) }),
		response: IngredientEntity.schema.array(),
	};
}
