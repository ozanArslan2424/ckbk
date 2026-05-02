import { C } from "@ozanarslan/corpus";

import { CookbookModel } from "@/Cookbook/CookbookModel";
import type { CookbookService } from "@/Cookbook/CookbookService";
import { ProfileService } from "@/Profile/ProfileService";

export class CookbookController extends C.Controller {
	constructor(private readonly service: CookbookService) {
		super();
	}
	override prefix?: string | undefined = "/cookbook";

	get = this.route(
		{ method: "GET", path: "/:id" },
		(c) => this.service.get(c.params),
		CookbookModel.get,
	);

	create = this.route(
		{ method: "POST", path: "/" },
		(c) => {
			ProfileService.assertProfile(c.data.profile);
			return this.service.create(c.body, c.data.profile);
		},
		CookbookModel.create,
	);

	update = this.route(
		{ method: "PUT", path: "/:id" },
		(c) => {
			ProfileService.assertProfile(c.data.profile);
			return this.service.update(c.params, c.body, c.data.profile);
		},
		CookbookModel.update,
	);
}
