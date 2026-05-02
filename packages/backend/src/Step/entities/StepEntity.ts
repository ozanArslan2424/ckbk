import { C } from "@ozanarslan/corpus";
import { type } from "arktype";

export class StepEntity extends C.Entity({
	name: "Step",
	schema: type({
		id: "number",
		createdAt: "Date",
		updatedAt: "Date",
		order: "number",
		body: "string",
		recipeId: "number",
	}),
}) {}
