import { C } from "@ozanarslan/corpus";
import { type } from "arktype";

export class IngredientEntity extends C.Entity({
	name: "Ingredient",
	schema: type({
		id: "number",
		createdAt: "Date",
		updatedAt: "Date",
		quantity: "number",
		material: "string",
		materialId: "number",
		measurement: "string",
		measurementId: "number",
		recipeId: "number | null",
	}),
}) {}
