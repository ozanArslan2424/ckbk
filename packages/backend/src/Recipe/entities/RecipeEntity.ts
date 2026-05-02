import { C } from "@ozanarslan/corpus";
import { type } from "arktype";

export class RecipeEntity extends C.Entity({
	name: "Recipe",
	schema: type({
		id: "number",
		createdAt: "Date",
		updatedAt: "Date",
		title: "string > 5",
		description: "string",
		image: "string | null",
		isPublic: "boolean",
		profileId: "number",
		isLiked: type("boolean").default(false),
		likeCount: type("number").default(0),
	}),
}) {}
