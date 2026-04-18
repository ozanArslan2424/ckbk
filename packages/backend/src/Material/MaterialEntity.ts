import { C } from "@ozanarslan/corpus";
import { type } from "arktype";

export class MaterialEntity extends C.Entity({
	name: "Material",
	schema: type({
		id: "number",
		createdAt: "Date",
		updatedAt: "Date",
		title: "string",
		description: "string | null",
	}),
}) {}
