import { X } from "@ozanarslan/corpus";
import { type } from "arktype";

import { BasePaginatedSchema } from "@/Base/BasePaginatedSchema";
import { IngredientEntity } from "@/Ingredient/IngredientEntity";
import { RecipeEntity } from "@/Recipe/RecipeEntity";
import { StepEntity } from "@/Step/StepEntity";

export type RecipeType = X.InferModel<typeof RecipeModel>;

export class RecipeModel {
	static create = {
		body: RecipeEntity.schema.pick("title", "description").and({
			isPublic: type("string").pipe((v) => v === "true"),
			"image?": "File",
		}),
		response: RecipeEntity.schema,
	};

	static update = {
		params: type({ id: type("string").pipe(Number) }),
		body: this.create.body.partial().and({
			deletedIngredientIds: "number[]",
			newIngredients: IngredientEntity.schema
				.pick("id", "materialId", "measurementId", "quantity")
				.array(),
			updatedSteps: StepEntity.schema.pick("id", "order", "body").array(),
			newSteps: StepEntity.schema.pick("order", "body").array(),
		}),
		response: RecipeEntity.schema,
	};

	static list = {
		search: type({
			"search?": "string",
			"mine?": "boolean",
			"page?": "number",
			"limit?": "number",
			"sortOrder?": type("'asc'|'desc'"),
			"sortBy?": type("'createdAt'|'title'|'likes'|'steps'"),
			"materialIds?": "number[]",
		}),
		response: BasePaginatedSchema.and({
			data: RecipeEntity.schema.array(),
		}),
	};

	static listPopular = {
		search: type({
			"page?": "number",
			"limit?": "number",
		}),
		response: RecipeEntity.schema.array(),
	};

	static like = {
		body: RecipeEntity.schema.pick("id").and({ isLiked: "boolean" }),
		response: RecipeEntity.schema.pick("id"),
	};
}
