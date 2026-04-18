import { C } from "@ozanarslan/corpus";
import { type } from "arktype";

export class UserEntity extends C.Entity({
	name: "User",
	schema: type({
		id: "string",
		createdAt: "Date",
		updatedAt: "Date",
		email: "string.email",
		emailVerified: "boolean",
		password: "string",
	}),
}) {
	static safeSchema = this.schema.omit("password");

	toSafe(entity: UserEntity) {
		const { password: _, ...safe } = entity;
		return safe;
	}
}
