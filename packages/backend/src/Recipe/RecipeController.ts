import { C } from "@ozanarslan/corpus";

import { ProfileService } from "@/Profile/ProfileService";
import { RecipeModel } from "@/Recipe/RecipeModel";
import type { RecipeService } from "@/Recipe/RecipeService";

export class RecipeController extends C.Controller {
	constructor(private readonly service: RecipeService) {
		super();
	}
	override prefix?: string | undefined = "/recipe";
	override beforeEach?: C.MiddlewareHandler | undefined = (c) => {
		ProfileService.assertProfile(c.data.profile);
	};

	create = this.route(
		{ method: "POST", path: "/" },
		(c) => this.service.create(c.body, c.data.profile!),
		RecipeModel.create,
	);

	update = this.route(
		{ method: "PUT", path: "/:id" },
		(c) => this.service.update(c.params, c.body, c.data.profile!),
		RecipeModel.update,
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
