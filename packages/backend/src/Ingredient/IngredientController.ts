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
			throw new C.Error("Unauthorized", C.Status.UNAUTHORIZED);
		}
	}

	create = this.route(
		{ method: "POST", path: "/" },
		async (c) => {
			this.guard(c.data.profile);
			return await this.service.create(c.body, c.data.profile);
		},
		IngredientModel.create,
	);

	listByRecipe = this.route(
		"/by-recipe/:recipeId",
		async (c) => {
			this.guard(c.data.profile);
			return await this.service.listByRecipe(c.params.recipeId);
		},
		IngredientModel.listByRecipe,
	);
}
