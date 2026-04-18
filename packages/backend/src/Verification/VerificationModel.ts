import { X } from "@ozanarslan/corpus";
import { type } from "arktype";

export type VerificationType = X.InferModel<typeof VerificationModel>;

export class VerificationModel {
	static entity = type({
		createdAt: "Date",
		updatedAt: "Date",
		variant: "string",
		value: "string",
		expiresAt: "Date",
		userId: "string",
	});
}
