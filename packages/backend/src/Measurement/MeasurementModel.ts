import { X } from "@ozanarslan/corpus";

import { MeasurementEntity } from "@/Measurement/MeasurementEntity";

export type MeasurementType = X.InferModel<typeof MeasurementModel>;

export class MeasurementModel {
	static create = {
		body: MeasurementEntity.schema.pick("title", "description"),
		response: MeasurementEntity.schema,
	};

	static list = {
		response: MeasurementEntity.schema.array(),
	};
}
