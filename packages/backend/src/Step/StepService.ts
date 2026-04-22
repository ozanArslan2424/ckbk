import { C } from "@ozanarslan/corpus";

import type { DatabaseClient } from "@/Database/DatabaseClient";
import type { ProfileEntity } from "@/Profile/ProfileEntity";
import type { StepType } from "@/Step/StepModel";

export class StepService {
	constructor(private readonly db: DatabaseClient) {}

	async create(
		body: StepType["create"]["body"],
		profile: ProfileEntity,
	): Promise<StepType["create"]["response"]> {
		const recipe = await this.db.recipe.findUnique({
			where: { id: body.recipeId, profileId: profile.id },
		});
		if (!recipe) {
			throw new C.Exception("Cannot add steps to someone else's recipe.", C.Status.FORBIDDEN);
		}

		return await this.db.step.create({
			data: {
				body: body.body,
				order: body.order,
				recipeId: body.recipeId,
			},
		});
	}

	async update(
		params: StepType["update"]["params"],
		body: StepType["update"]["body"],
		profile: ProfileEntity,
	): Promise<StepType["update"]["response"]> {
		const recipe = await this.db.recipe.findUnique({
			where: { id: body.recipeId, profileId: profile.id },
		});
		if (!recipe) {
			throw new C.Exception("Cannot add steps to someone else's recipe.", C.Status.FORBIDDEN);
		}

		return await this.db.step.update({
			where: { id: params.id },
			data: {
				body: body.body,
				order: body.order,
				recipeId: body.recipeId,
			},
		});
	}

	async listByRecipe(recipeId: number): Promise<StepType["listByRecipe"]["response"]> {
		return await this.db.step.findMany({ where: { recipeId } });
	}
}
