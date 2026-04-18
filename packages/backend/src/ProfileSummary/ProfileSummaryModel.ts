import type { X } from "@ozanarslan/corpus";
import { type } from "arktype";

import { ProfileSummaryEntity } from "@/ProfileSummary/ProfileSummaryEntity";

export type ProfileSummaryType = X.InferModel<typeof ProfileSummaryModel>;

export class ProfileSummaryModel {
	static get = {
		params: type({ id: type("string").pipe(Number) }),
		response: ProfileSummaryEntity.schema,
	};
}
