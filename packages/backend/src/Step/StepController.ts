import { C } from "@ozanarslan/corpus";

import { ProfileService } from "@/Profile/ProfileService";
import { StepModel } from "@/Step/StepModel";
import type { StepService } from "@/Step/StepService";

export class StepController extends C.Controller {
	constructor(private readonly service: StepService) {
		super();
	}

	override prefix?: string | undefined = "/step";

	create = this.route(
		{ method: "POST", path: "/" },
		async (c) => {
			ProfileService.assertProfile(c.data.profile);
			return this.service.create(c.body, c.data.profile);
		},
		StepModel.create,
	);

	update = this.route(
		{ method: "PUT", path: "/:id" },
		async (c) => {
			ProfileService.assertProfile(c.data.profile);
			return this.service.update(c.params, c.body, c.data.profile);
		},
		StepModel.update,
	);

	listByRecipe = this.route(
		"/by-recipe/:id",
		async (c) => {
			ProfileService.assertProfile(c.data.profile);
			return this.service.listByRecipe(c.params.id);
		},
		StepModel.listByRecipe,
	);
}
