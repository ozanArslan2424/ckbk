import type { DatabaseClient } from "@/Database/DatabaseClient";
import type { ProfileEntity } from "@/Profile/entities/ProfileEntity";
import { StepException } from "@/Step/StepException";
import type { StepType } from "@/Step/StepModel";

export class StepService {
	constructor(private readonly db: DatabaseClient) {}

	async create(body: StepType["create"]["body"], profile: ProfileEntity) {
		const recipe = await this.db.recipe.findUnique({
			where: { id: body.recipeId, profileId: profile.id },
		});
		if (!recipe) {
			throw StepException.differentOwner;
		}

		return this.db.step.create({
			data: {
				body: body.body,
				order: body.order,
				recipeId: body.recipeId,
				language: profile.language,
			},
		});
	}

	async update(
		params: StepType["update"]["params"],
		body: StepType["update"]["body"],
		profile: ProfileEntity,
	) {
		const recipe = await this.db.recipe.findUnique({
			where: { id: body.recipeId, profileId: profile.id },
		});
		if (!recipe) {
			throw StepException.differentOwner;
		}

		return this.db.step.update({
			where: { id: params.id },
			data: {
				body: body.body,
				order: body.order,
				recipeId: body.recipeId,
			},
		});
	}

	async listByRecipe(recipeId: number) {
		return this.db.step.findMany({ where: { recipeId } });
	}
}
