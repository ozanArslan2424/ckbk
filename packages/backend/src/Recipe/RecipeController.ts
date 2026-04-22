import { C } from "@ozanarslan/corpus";

import { RecipeModel } from "@/Recipe/RecipeModel";
import type { RecipeService } from "@/Recipe/RecipeService";

export class RecipeController extends C.Controller {
	constructor(private readonly service: RecipeService) {
		super();
	}
	override prefix?: string | undefined = "/recipe";
	override beforeEach?: C.MiddlewareHandler | undefined = (c) => {
		if (!c.data.profile) {
			throw new C.Exception("Unauthorized", C.Status.UNAUTHORIZED);
		}
	};

	create = this.route(
		{ method: "POST", path: "/" },
		async (c) => this.service.create(c.body, c.data.profile!),
		RecipeModel.create,
	);

	update = this.route(
		{ method: "PUT", path: "/:id" },
		async (c) => this.service.update(c.params, c.body, c.data.profile!),
		RecipeModel.update,
	);

	list = this.route(
		{ method: "GET", path: "/" },
		async (c) => this.service.list(c.search, c.data.profile!),
		RecipeModel.list,
	);

	listPopular = this.route(
		{ method: "GET", path: "/popular" },
		async (c) => this.service.listPopular(c.search, c.data.profile!),
		RecipeModel.listPopular,
	);

	like = this.route(
		{ method: "POST", path: "/like" },
		async (c) => this.service.like(c.body, c.data.profile!),
		RecipeModel.like,
	);
}
