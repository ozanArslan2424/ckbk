import { C } from "@ozanarslan/corpus";
import { type } from "arktype";

export class RefreshTokenEntity extends C.Entity({
	name: "RefreshToken",
	schema: type({
		id: "string",
		isValid: "boolean",
		expiresAt: "Date",
		userId: "string",
	}),
}) {}
