import type { DatabaseClient } from "@/Database/DatabaseClient";
import { IngredientEntity } from "@/Ingredient/entities/IngredientEntity";
import { IngredientException } from "@/Ingredient/IngredientException";
import type { IngredientType } from "@/Ingredient/IngredientModel";
import type { ProfileEntity } from "@/Profile/entities/ProfileEntity";

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
			throw IngredientException.differentOwner;
		}

		const ingredient = await this.db.ingredient.create({
			data: { ...body, language: profile.language },
			include: { material: { select: { title: true } }, measurement: { select: { title: true } } },
		});

		return new IngredientEntity({
			...ingredient,
			material: ingredient.material.title,
			measurement: ingredient.measurement.title,
		});
	}

	async update(
		params: IngredientType["update"]["params"],
		body: IngredientType["update"]["body"],
		profile: ProfileEntity,
	): Promise<IngredientType["update"]["response"]> {
		const recipe = await this.db.recipe.findUnique({
			where: { id: body.recipeId, profileId: profile.id },
		});
		if (!recipe) {
			throw IngredientException.differentOwner;
		}

		const ingredient = await this.db.ingredient.update({
			where: { id: params.id },
			data: body,
			include: { material: { select: { title: true } }, measurement: { select: { title: true } } },
		});

		return new IngredientEntity({
			...ingredient,
			material: ingredient.material.title,
			measurement: ingredient.measurement.title,
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
