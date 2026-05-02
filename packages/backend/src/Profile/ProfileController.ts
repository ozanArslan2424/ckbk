import { C } from "@ozanarslan/corpus";

import { AuthException } from "@/Auth/AuthException";
import { ProfileModel } from "@/Profile/ProfileModel";
import type { ProfileService } from "@/Profile/ProfileService";

export class ProfileController extends C.Controller {
	constructor(private readonly service: ProfileService) {
		super();
	}

	override prefix?: string | undefined = "/profile";

	get = this.route(
		{ method: "GET", path: "/" },
		async (c) => {
			if (!c.data.jwtPayload) throw AuthException.unauthorized;
			return await this.service.get(c.data.jwtPayload.userId);
		},
		ProfileModel.get,
	);

	create = this.route(
		{ method: "POST", path: "/" },
		async (c) => {
			if (!c.data.jwtPayload) throw AuthException.unauthorized;
			return await this.service.create(c.body, c.data.jwtPayload.userId, c.data.jwtPayload.email);
		},
		ProfileModel.create,
	);

	stats = this.route(
		{ method: "GET", path: "/stats/:id" },
		(c) => this.service.stats(c.params),
		ProfileModel.stats,
	);
}
