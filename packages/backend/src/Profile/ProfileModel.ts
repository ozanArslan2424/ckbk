import { X } from "@ozanarslan/corpus";
import { type } from "arktype";

import { ProfileEntity } from "@/Profile/entities/ProfileEntity";
import { StatsEntity } from "@/Profile/entities/StatsEntity";

export type ProfileType = X.InferModel<typeof ProfileModel>;

export class ProfileModel {
	static readonly get = {
		response: ProfileEntity.schema,
	};

	static readonly create = {
		body: type({
			name: "string > 1",
			language: "'tr'|'en'",
		}),
		response: ProfileEntity.schema,
	};

	static readonly stats = {
		params: type({ id: "number" }),
		response: StatsEntity.schema,
	};
}
