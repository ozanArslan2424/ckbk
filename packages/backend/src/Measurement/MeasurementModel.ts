import { X } from "@ozanarslan/corpus";

import { MeasurementEntity } from "@/Measurement/entities/MeasurementEntity";

export type MeasurementType = X.InferModel<typeof MeasurementModel>;

export class MeasurementModel {
	static readonly create = {
		body: MeasurementEntity.schema.pick("title", "description"),
		response: MeasurementEntity.schema,
	};

	static readonly list = {
		response: MeasurementEntity.schema.array(),
	};
}
