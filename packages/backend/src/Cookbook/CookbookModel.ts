import type { X } from "@ozanarslan/corpus";
import { type } from "arktype";

import { CookbookEntity } from "@/Cookbook/entities/CookbookEntity";

export type CookbookType = X.InferModel<typeof CookbookModel>;

export class CookbookModel {
	static readonly get = {
		params: type({ id: "number" }),
		response: CookbookEntity.schema,
	};

	private static readonly ingredientCreate = type({
		quantity: "number",
		materialId: "number",
		measurementId: "number",
	});

	private static readonly stepCreate = type({
		order: "number",
		body: "string",
	});

	static readonly create = {
		body: type({
			title: "string > 5",
			description: "string",
			isPublic: "boolean",
			"image?": "File",
			ingredients: this.ingredientCreate.array(),
			steps: this.stepCreate.array(),
		}),
		response: CookbookEntity.schema,
	};

	static readonly update = {
		params: type({ id: "number" }),
		body: type({
			"title?": "string > 5",
			"description?": "string",
			"isPublic?": "boolean",
			"image?": "File",
			"deletedIngredientIds?": "number[]",
			"newIngredients?": this.ingredientCreate.array(),
			"updatedSteps?": this.stepCreate.and({ id: "number" }).array(),
			"newSteps?": this.stepCreate.array(),
		}),
		response: CookbookEntity.schema,
	};
}
