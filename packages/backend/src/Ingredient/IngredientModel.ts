import { X } from "@ozanarslan/corpus";
import { type } from "arktype";

import { IngredientEntity } from "@/Ingredient/entities/IngredientEntity";

export type IngredientType = X.InferModel<typeof IngredientModel>;

export class IngredientModel {
	static readonly create = {
		body: IngredientEntity.schema.pick("quantity", "materialId", "measurementId").and({
			recipeId: "number",
		}),
		response: IngredientEntity.schema,
	};

	static readonly update = {
		params: type({ id: "number" }),
		body: this.create.body.partial(),
		response: IngredientEntity.schema,
	};

	static readonly listByRecipe = {
		params: type({ id: "number" }),
		response: IngredientEntity.schema.array(),
	};
}
