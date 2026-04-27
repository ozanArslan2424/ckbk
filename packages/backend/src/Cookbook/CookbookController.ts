import { C, type ContextDataInterface } from "@ozanarslan/corpus";

import { CookbookModel } from "@/Cookbook/CookbookModel";
import type { CookbookService } from "@/Cookbook/CookbookService";

export class CookbookController extends C.Controller {
	constructor(private readonly service: CookbookService) {
		super();
	}
	override prefix?: string | undefined = "/cookbook";

	guard(profile?: ContextDataInterface["profile"]): asserts profile {
		if (!profile) {
			throw new C.Exception("Unauthorized", C.Status.UNAUTHORIZED);
		}
	}

	get = this.route(
		{ method: "GET", path: "/:id" },
		(c) => this.service.get(c.params),
		CookbookModel.get,
	);

	create = this.route(
		{ method: "POST", path: "/" },
		(c) => {
			this.guard(c.data.profile);
			return this.service.create(c.body, c.data.profile);
		},
		CookbookModel.create,
	);

	update = this.route(
		{ method: "PUT", path: "/:id" },
		(c) => {
			this.guard(c.data.profile);
			return this.service.update(c.params, c.body, c.data.profile);
		},
		CookbookModel.update,
	);
}
