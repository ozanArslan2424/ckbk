import { C } from "@ozanarslan/corpus";

import { MeasurementModel } from "@/Measurement/MeasurementModel";
import type { MeasurementService } from "@/Measurement/MeasurementService";

export class MeasurementController extends C.Controller {
	constructor(private readonly service: MeasurementService) {
		super();
	}

	override prefix?: string | undefined = "/measurement";

	create = this.route(
		{ method: "POST", path: "/" },
		async (c) => {
			return await this.service.create(c.body);
		},
		MeasurementModel.create,
	);

	list = this.route({ method: "GET", path: "/" }, () => this.service.list(), MeasurementModel.list);
}
