import { C, type ContextDataInterface } from "@ozanarslan/corpus";

import { IngredientModel } from "@/Ingredient/IngredientModel";
import type { IngredientService } from "@/Ingredient/IngredientService";

export class IngredientController extends C.Controller {
	constructor(private readonly service: IngredientService) {
		super();
	}

	override prefix?: string | undefined = "/ingredient";

	private guard(profile: ContextDataInterface["profile"]): asserts profile {
		if (!profile) {
			throw new C.Exception("Unauthorized", C.Status.UNAUTHORIZED);
		}
	}

	create = this.route(
		{ method: "POST", path: "/" },
		async (c) => {
			this.guard(c.data.profile);
			return this.service.create(c.body, c.data.profile);
		},
		IngredientModel.create,
	);

	update = this.route(
		{ method: "PUT", path: "/:id" },
		async (c) => {
			this.guard(c.data.profile);
			return this.service.update(c.params, c.body, c.data.profile);
		},
		IngredientModel.update,
	);

	listByRecipe = this.route(
		"/by-recipe/:id",
		async (c) => {
			this.guard(c.data.profile);
			return this.service.listByRecipe(c.params.id);
		},
		IngredientModel.listByRecipe,
	);
}
