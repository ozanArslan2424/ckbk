import { C } from "@ozanarslan/corpus";

import { MaterialModel } from "@/Material/MaterialModel";
import type { MaterialService } from "@/Material/MaterialService";
import { ProfileService } from "@/Profile/ProfileService";

export class MaterialController extends C.Controller {
	constructor(private readonly service: MaterialService) {
		super();
	}

	override prefix?: string | undefined = "/material";
	override beforeEach?: C.MiddlewareHandler = (c) => {
		ProfileService.assertProfile(c.data.profile);
	};

	create = this.route(
		{ method: "POST", path: "/" },
		async (c) => {
			return await this.service.create(c.body, c.data.profile!);
		},
		MaterialModel.create,
	);

	list = this.route(
		{ method: "GET", path: "/" },
		async (c) => this.service.list(c.data.profile!),
		MaterialModel.list,
	);
}
