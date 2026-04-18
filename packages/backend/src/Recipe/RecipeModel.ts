import { X } from "@ozanarslan/corpus";
import { type } from "arktype";

import { BasePaginatedSchema } from "@/Base/BasePaginatedSchema";
import { RecipeEntity } from "@/Recipe/RecipeEntity";

export type RecipeType = X.InferModel<typeof RecipeModel>;

export class RecipeModel {
	static create = {
		body: RecipeEntity.schema.pick("title", "description").and({
			isPublic: type("string").pipe((v) => v === "true"),
			"image?": "File",
		}),
		response: RecipeEntity.schema,
	};

	static list = {
		search: type({
			"search?": "string",
			"mine?": type("string").pipe((v) => v === "true"),
			"page?": type("string").pipe(Number),
			"limit?": type("string").pipe(Number),
			"sortOrder?": type("'asc'|'desc'"),
			"sortBy?": type("'createdAt'|'title'|'likes'|'steps'"),
			"materialIds?": type("string[]").pipe((arr) => arr.map(Number)),
		}),
		response: BasePaginatedSchema.and({
			data: RecipeEntity.schema.array(),
		}),
	};

	static listPopular = {
		search: type({
			"page?": type("string").pipe(Number),
			"limit?": type("string").pipe(Number),
		}),
		response: RecipeEntity.schema.array(),
	};

	static like = {
		body: RecipeEntity.schema.pick("id").and({ isLiked: "boolean" }),
		response: RecipeEntity.schema.pick("id"),
	};
}
