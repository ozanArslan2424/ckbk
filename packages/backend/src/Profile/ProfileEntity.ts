import { C } from "@ozanarslan/corpus";
import { type } from "arktype";

export class ProfileEntity extends C.Entity({
	name: "Profile",
	schema: type({
		id: "number",
		createdAt: "Date",
		updatedAt: "Date",
		name: "string",
		email: "string.email",
		image: "string | null",
	}),
}) {}
