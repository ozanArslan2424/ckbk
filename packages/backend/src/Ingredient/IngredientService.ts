import { C } from "@ozanarslan/corpus";

import type { DatabaseClient } from "@/Database/DatabaseClient";
import type { IngredientType } from "@/Ingredient/IngredientModel";
import type { ProfileEntity } from "@/Profile/ProfileEntity";

export class IngredientService {
	constructor(private readonly db: DatabaseClient) {}

	async create(
		body: IngredientType["create"]["body"],
		profile: ProfileEntity,
	): Promise<IngredientType["create"]["response"]> {
		const recipe = await this.db.recipe.findUnique({
			where: { id: body.recipeId, profileId: profile.id },
		});
		if (!recipe) {
			throw new C.Error("Cannot add ingredients to someone else's recipe.", C.Status.FORBIDDEN);
		}

		return await this.db.ingredient.create({
			data: {
				quantity: body.quantity,
				recipeId: body.recipeId,
				materialId: body.materialId,
				measurementId: body.measurementId,
			},
		});
	}

	async listByRecipe(recipeId: number): Promise<IngredientType["listByRecipe"]["response"]> {
		const ingredients = await this.db.ingredient.findMany({
			where: { recipeId },
			include: { material: true, measurement: true },
		});
		return ingredients.map((ing) => ({
			...ing,
			material: ing.material.title,
			measurement: ing.measurement.title,
		}));
	}
}
