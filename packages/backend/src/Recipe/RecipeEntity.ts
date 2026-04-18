import { C } from "@ozanarslan/corpus";
import { type } from "arktype";

export class RecipeEntity extends C.Entity({
	name: "Recipe",
	schema: type({
		id: "number",
		createdAt: "Date",
		updatedAt: "Date",
		title: "string > 1",
		description: "string",
		image: "string | null",
		isPublic: "boolean",
		profileId: "number",
		isLiked: "boolean",
		likeCount: "number",
	}),
}) {}
