import { X } from "@ozanarslan/corpus";

import { MaterialEntity } from "@/Material/MaterialEntity";

export type MaterialType = X.InferModel<typeof MaterialModel>;

export class MaterialModel {
	static create = {
		body: MaterialEntity.schema.pick("title", "description"),
		response: MaterialEntity.schema,
	};

	static list = {
		response: MaterialEntity.schema.array(),
	};
}
