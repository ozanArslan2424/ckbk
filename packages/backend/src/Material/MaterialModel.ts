import { X } from "@ozanarslan/corpus";

import { MaterialEntity } from "@/Material/entities/MaterialEntity";

export type MaterialType = X.InferModel<typeof MaterialModel>;

export class MaterialModel {
	static readonly create = {
		body: MaterialEntity.schema.pick("title", "description"),
		response: MaterialEntity.schema,
	};

	static readonly list = {
		response: MaterialEntity.schema.array(),
	};
}
