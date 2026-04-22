import { C, type ContextDataInterface } from "@ozanarslan/corpus";

import { StepModel } from "@/Step/StepModel";
import type { StepService } from "@/Step/StepService";

export class StepController extends C.Controller {
	constructor(private readonly service: StepService) {
		super();
	}

	override prefix?: string | undefined = "/step";

	private guard(profile: ContextDataInterface["profile"]): asserts profile {
		if (!profile) {
			throw new C.Exception("Unauthorized", C.Status.UNAUTHORIZED);
		}
	}

	create = this.route(
		{ method: "POST", path: "/" },
		async (c) => {
			this.guard(c.data.profile);
			return await this.service.create(c.body, c.data.profile);
		},
		StepModel.create,
	);

	update = this.route(
		{ method: "PUT", path: "/:id" },
		async (c) => {
			this.guard(c.data.profile);
			return await this.service.update(c.params, c.body, c.data.profile);
		},
		StepModel.update,
	);

	listByRecipe = this.route(
		"/by-recipe/:id",
		async (c) => {
			this.guard(c.data.profile);
			return await this.service.listByRecipe(c.params.id);
		},
		StepModel.listByRecipe,
	);
}
