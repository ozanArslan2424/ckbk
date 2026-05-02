import { C } from "@ozanarslan/corpus";

import { MeasurementModel } from "@/Measurement/MeasurementModel";
import type { MeasurementService } from "@/Measurement/MeasurementService";
import { ProfileService } from "@/Profile/ProfileService";

export class MeasurementController extends C.Controller {
	constructor(private readonly service: MeasurementService) {
		super();
	}

	override prefix?: string | undefined = "/measurement";
	override beforeEach?: C.MiddlewareHandler = (c) => {
		ProfileService.assertProfile(c.data.profile);
	};

	create = this.route(
		{ method: "POST", path: "/" },
		async (c) => {
			return await this.service.create(c.body, c.data.profile!);
		},
		MeasurementModel.create,
	);

	list = this.route(
		{ method: "GET", path: "/" },
		async (c) => this.service.list(c.data.profile!),
		MeasurementModel.list,
	);
}
