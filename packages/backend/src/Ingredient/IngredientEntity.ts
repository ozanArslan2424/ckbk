import { C } from "@ozanarslan/corpus";
import { type } from "arktype";

export class IngredientEntity extends C.Entity({
	name: "Ingredient",
	schema: type({
		id: "number",
		createdAt: "Date",
		updatedAt: "Date",
		quantity: "number",
		recipeId: "number | null",
		materialId: "number",
		measurementId: "number",
	}),
}) {}
