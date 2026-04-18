import type { Prisma } from "prisma/generated/browser";

import { PaginatedData } from "@/Base/PaginatedData";
import type { DatabaseClient } from "@/Database/DatabaseClient";
import type { ProfileEntity } from "@/Profile/ProfileEntity";
import type { RecipeType } from "@/Recipe/RecipeModel";

export class RecipeService {
	constructor(private readonly db: DatabaseClient) {}

	async create(
		body: RecipeType["create"]["body"],
		profile: ProfileEntity,
	): Promise<RecipeType["create"]["response"]> {
		let image;

		if (body.image) {
			const base64 = Buffer.from(await body.image.arrayBuffer()).toString("base64");
			image = `data:${body.image.type};base64,${base64}`;
		}

		const recipe = await this.db.recipe.create({
			data: {
				title: body.title,
				description: body.description,
				profileId: profile.id,
				isPublic: body.isPublic,
				image,
			},
		});

		return { ...recipe, likeCount: 0, isLiked: false };
	}

	async list(
		search: RecipeType["list"]["search"],
		profile: ProfileEntity,
	): Promise<RecipeType["list"]["response"]> {
		const page = search.page ?? 1;
		const limit = search.limit ?? 10;

		const [recipes, count] = await this.db.$transaction(async (tx) => {
			const { skip, take } = this.db.convertToSkipTake(search.page ?? 1, search.limit ?? 10);
			const where = this.buildListWhere(search, profile.id);
			const orderBy = this.buildListOrderBy(search);

			const recipesPromise = tx.recipe.findMany({
				where,
				skip,
				take,
				orderBy,
				include: { likes: { select: { profileId: true } } },
			});
			const countPromise = tx.recipe.count({ where });
			return await Promise.all([recipesPromise, countPromise]);
		});

		return new PaginatedData(
			page,
			limit,
			count,
			recipes.map((r) => ({
				...r,
				isLiked: r.likes.some((l) => l.profileId === profile.id),
				likeCount: r.likes.length,
			})),
		);
	}

	async listPopular(
		search: RecipeType["listPopular"]["search"],
		profile: ProfileEntity,
	): Promise<RecipeType["listPopular"]["response"]> {
		const { skip, take } = this.db.convertToSkipTake(search.page ?? 1, search.limit ?? 10);
		const lastMonth = new Date();
		lastMonth.setMonth(lastMonth.getMonth() - 1);
		lastMonth.setHours(0, 0, 0, 0); // Set to beginning of the day

		const recipes = await this.db.recipe.findMany({
			where: { isPublic: true, createdAt: { gte: lastMonth } },
			orderBy: { likes: { _count: "desc" } },
			skip,
			take,
			include: { likes: { select: { profileId: true } } },
		});

		return recipes.map((r) => ({
			...r,
			isLiked: r.likes.some((l) => l.profileId === profile.id),
			likeCount: r.likes.length,
		}));
	}

	async like(
		body: RecipeType["like"]["body"],
		profile: ProfileEntity,
	): Promise<RecipeType["like"]["response"]> {
		const likesWhere = { recipeId_profileId: { recipeId: body.id, profileId: profile.id } };

		if (body.isLiked) {
			await this.db.recipe.update({
				where: { id: body.id },
				data: {
					likes: { connectOrCreate: { where: likesWhere, create: { profileId: profile.id } } },
				},
			});
		} else {
			await this.db.recipe.update({
				where: { id: body.id },
				data: { likes: { delete: likesWhere } },
			});
		}
		return { id: body.id };
	}

	private buildListWhere(filters: RecipeType["list"]["search"], profileId: ProfileEntity["id"]) {
		const where: Prisma.RecipeFindManyArgs["where"] = {};

		if (filters.mine) {
			where.profileId = profileId;
		}

		if (filters.materialIds && filters.materialIds.length > 0) {
			where.AND = filters.materialIds.map((id) => ({
				ingredients: {
					some: { materialId: id },
				},
			}));
		}

		if (filters.search) {
			where.OR = [
				{
					title: {
						contains: filters.search,
						// TODO: not in sqlite
						// mode: "insensitive"
					},
				},
				{
					description: {
						contains: filters.search,
						// TODO: not in sqlite
						// mode: "insensitive"
					},
				},
			];
		}

		return where;
	}

	private buildListOrderBy(filters: RecipeType["list"]["search"]) {
		let orderBy: Prisma.RecipeOrderByWithRelationInput;

		if (filters.sortBy === "likes" || filters.sortBy === "steps") {
			orderBy = {
				[filters.sortBy]: {
					_count: filters.sortOrder,
				},
			};
		} else {
			orderBy = {
				[filters.sortBy ?? "createdAt"]: filters.sortOrder ?? "desc",
			};
		}

		return orderBy;
	}
}
