import { C } from "@ozanarslan/corpus";

import { AuthModel } from "@/Auth/AuthModel";
import type { AuthService } from "@/Auth/AuthService";

export class AuthController extends C.Controller {
	constructor(private readonly authService: AuthService) {
		super();
	}

	override prefix?: string | undefined = "/auth";

	login = this.route(
		{ method: "POST", path: "/login" },
		(c) => this.authService.login(c.body),
		AuthModel.login,
	);

	register = this.route(
		{ method: "POST", path: "/register" },
		async (c) => {
			await this.authService.register(c.body, c.data.locale);
			c.res.status = C.Status.CREATED;
			return { email: c.body.email };
		},
		AuthModel.register,
	);

	logout = this.route(
		{ method: "POST", path: "/logout" },
		(c) => this.authService.logout(c.body),
		AuthModel.logout,
	);

	refresh = this.route(
		{ method: "POST", path: "/refresh" },
		(c) => this.authService.refresh(c.body),
		AuthModel.refresh,
	);

	verify = this.route(
		{ method: "POST", path: "/verify" },
		(c) => this.authService.verify(c.body),
		AuthModel.verify,
	);
}
