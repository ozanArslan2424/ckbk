import { C } from "@ozanarslan/corpus";

import { MaterialModel } from "@/Material/MaterialModel";
import type { MaterialService } from "@/Material/MaterialService";

export class MaterialController extends C.Controller {
	constructor(private readonly service: MaterialService) {
		super();
	}

	override prefix?: string | undefined = "/material";

	create = this.route(
		{ method: "POST", path: "/" },
		(c) => this.service.create(c.body),
		MaterialModel.create,
	);

	list = this.route({ method: "GET", path: "/" }, () => this.service.list(), MaterialModel.list);
}
