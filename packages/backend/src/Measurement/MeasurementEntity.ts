import { C } from "@ozanarslan/corpus";
import { type } from "arktype";

export class MeasurementEntity extends C.Entity({
	name: "Measurement",
	schema: type({
		id: "number",
		createdAt: "Date",
		updatedAt: "Date",
		title: "string",
		description: "string | null",
	}),
}) {}
