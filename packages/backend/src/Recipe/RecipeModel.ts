import { X } from "@ozanarslan/corpus";
import { type } from "arktype";

import { BasePaginatedSchema } from "@/Base/BasePaginatedSchema";
import { RecipeEntity } from "@/Recipe/entities/RecipeEntity";

export type RecipeType = X.InferModel<typeof RecipeModel>;

export class RecipeModel {
	static readonly create = {
		body: RecipeEntity.schema.pick("title", "description", "isPublic").and({
			"image?": "File",
		}),
		response: RecipeEntity.schema,
	};

	static readonly update = {
		params: type({ id: "number" }),
		body: this.create.body.partial(),
		response: RecipeEntity.schema,
	};

	static readonly list = {
		search: type({
			"search?": "string",
			"page?": "number",
			"limit?": "number",
			"owner?": type("'me'|'others'|'all'"),
			"sortOrder?": type("'asc'|'desc'"),
			"sortBy?": type("'createdAt'|'title'|'likes'|'steps'"),
			"materialIds?": "number[]",
			"isLiked?": "boolean",
		}),
		response: BasePaginatedSchema.and({
			data: RecipeEntity.schema.array(),
		}),
	};

	static readonly listPopular = {
		search: type({
			"page?": "number",
			"limit?": "number",
		}),
		response: RecipeEntity.schema.array(),
	};

	static readonly like = {
		body: RecipeEntity.schema.pick("id").and({ isLiked: "boolean" }),
		response: RecipeEntity.schema.pick("id"),
	};
}
