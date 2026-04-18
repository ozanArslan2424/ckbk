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
			throw new C.Error("Unauthorized", C.Status.UNAUTHORIZED);
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

	listByRecipe = this.route(
		"/by-recipe/:recipeId",
		async (c) => {
			this.guard(c.data.profile);
			return await this.service.listByRecipe(c.params.recipeId);
		},
		StepModel.listByRecipe,
	);
}
