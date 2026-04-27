import type { X } from "@ozanarslan/corpus";
import { type } from "arktype";

import { CookbookEntity } from "@/Cookbook/CookbookEntity";

export type CookbookType = X.InferModel<typeof CookbookModel>;

export class CookbookModel {
	static get = {
		params: type({ id: "number" }),
		response: CookbookEntity.schema,
	};

	static create = {
		body: type({
			title: "string > 5",
			description: "string",
			isPublic: "boolean",
			"image?": "File",
			ingredients: type({
				quantity: "number",
				materialId: "number",
				measurementId: "number",
			}).array(),
			steps: type({
				order: "number",
				body: "string",
			}).array(),
		}),
		response: CookbookEntity.schema,
	};

	static update = {
		params: type({ id: "number" }),
		body: type({
			"title?": "string > 5",
			"description?": "string",
			"isPublic?": "boolean",
			"image?": "File",
			"deletedIngredientIds?": "number[]",
			"newIngredients?": type({
				quantity: "number",
				materialId: "number",
				measurementId: "number",
			}).array(),
			"updatedSteps?": type({
				id: "number",
				order: "number",
				body: "string",
			}).array(),
			"newSteps?": type({
				order: "number",
				body: "string",
			}).array(),
		}),
		response: CookbookEntity.schema,
	};
}
