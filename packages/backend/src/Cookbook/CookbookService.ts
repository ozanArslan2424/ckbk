import type { Prisma } from "prisma/generated/browser";

import type { CookbookType } from "@/Cookbook/CookbookModel";
import { CookbookEntity } from "@/Cookbook/entities/CookbookEntity";
import type { DatabaseClient } from "@/Database/DatabaseClient";
import type { ProfileEntity } from "@/Profile/entities/ProfileEntity";
import { RecipeException } from "@/Recipe/RecipeException";

export class CookbookService {
	constructor(private readonly db: DatabaseClient) {}

	async get(params: CookbookType["get"]["params"], profile?: ProfileEntity) {
		const recipe = await this.db.recipe.findUnique({
			where: { id: params.id },
			include: {
				likes: { select: { profileId: true } },
				ingredients: {
					include: { material: true, measurement: true },
				},
				steps: true,
			},
		});

		if (!recipe) {
			throw RecipeException.notFound;
		}

		return new CookbookEntity({
			...recipe,
			isLiked: profile ? recipe.likes.some((l) => l.profileId === profile.id) : false,
			likeCount: recipe.likes.length,
			ingredients: recipe.ingredients.map((ing) => ({
				...ing,
				material: ing.material.title,
				measurement: ing.measurement.title,
			})),
		});
	}

	async create(body: CookbookType["create"]["body"], profile: ProfileEntity) {
		const language = profile.language;
		let image: string | undefined;

		if (body.image) {
			const base64 = Buffer.from(await body.image.arrayBuffer()).toString("base64");
			image = `data:${body.image.type};base64,${base64}`;
		}

		const result = await this.db.$transaction(async (tx) => {
			const recipe = await tx.recipe.create({
				data: {
					title: body.title,
					description: body.description,
					profileId: profile.id,
					isPublic: body.isPublic,
					image,
					language,
				},
			});
			await Promise.all([
				tx.ingredient.createMany({
					data: body.ingredients.map((it) => ({ ...it, recipeId: recipe.id, language })),
				}),
				tx.step.createMany({
					data: body.steps.map((it) => ({ ...it, recipeId: recipe.id, language })),
				}),
			]);
			return tx.recipe.findUniqueOrThrow({
				where: { id: recipe.id },
				include: {
					likes: { select: { profileId: true } },
					ingredients: { include: { material: true, measurement: true } },
					steps: true,
				},
			});
		});

		return new CookbookEntity({
			...result,
			isLiked: false,
			likeCount: 0,
			ingredients: result.ingredients.map((ing) => ({
				...ing,
				material: ing.material.title,
				measurement: ing.measurement.title,
			})),
		});
	}

	async update(
		params: CookbookType["update"]["params"],
		body: CookbookType["update"]["body"],
		profile: ProfileEntity,
	) {
		const language = profile.language;
		const data: Prisma.RecipeUpdateArgs["data"] = {};

		if (body.title) data.title = body.title;
		if (body.description) data.description = body.description;
		if (body.isPublic != undefined) data.isPublic = body.isPublic;

		if (body.image) {
			const base64 = Buffer.from(await body.image.arrayBuffer()).toString("base64");
			data.image = `data:${body.image.type};base64,${base64}`;
		}

		if (body.deletedIngredientIds?.length) {
			data.ingredients ??= {};
			data.ingredients.deleteMany = this.db.whereIn("id", body.deletedIngredientIds);
		}

		if (body.newIngredients?.length) {
			data.ingredients ??= {};
			data.ingredients.connectOrCreate = body.newIngredients.map((it) => ({
				where: { recipeId_materialId: { recipeId: params.id, materialId: it.materialId } },
				create: { ...it, language },
			}));
		}

		if (body.updatedSteps?.length) {
			data.steps ??= {};
			data.steps.updateMany = body.updatedSteps.map((step) => ({
				where: { id: step.id },
				data: { body: step.body, order: step.order },
			}));
		}

		if (body.newSteps?.length) {
			data.steps ??= {};
			data.steps.create = body.newSteps.map((it) => ({ ...it, language }));
		}

		const recipe = await this.db.recipe.update({
			where: { id: params.id },
			data,
			include: {
				likes: { select: { profileId: true } },
				ingredients: {
					include: { material: true, measurement: true },
				},
				steps: true,
			},
		});

		return new CookbookEntity({
			...recipe,
			isLiked: recipe.likes.some((l) => l.profileId === profile.id),
			likeCount: recipe.likes.length,
			ingredients: recipe.ingredients.map((ing) => ({
				...ing,
				material: ing.material.title,
				measurement: ing.measurement.title,
			})),
		});
	}
}
