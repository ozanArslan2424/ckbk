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
			throw new C.Error("Unauthorized", C.Status.UNAUTHORIZED);
		}
	};

	create = this.route(
		{ method: "POST", path: "/" },
		(c) => this.service.create(c.body, c.data.profile!),
		RecipeModel.create,
	);

	list = this.route(
		{ method: "GET", path: "/" },
		(c) => this.service.list(c.search, c.data.profile!),
		RecipeModel.list,
	);

	listPopular = this.route(
		{ method: "GET", path: "/popular" },
		(c) => this.service.listPopular(c.search, c.data.profile!),
		RecipeModel.listPopular,
	);

	like = this.route(
		{ method: "POST", path: "/like" },
		(c) => this.service.like(c.body, c.data.profile!),
		RecipeModel.like,
	);
}
