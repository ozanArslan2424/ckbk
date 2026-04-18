import { C } from "@ozanarslan/corpus";

import type { AuthService } from "@/Auth/AuthService";

export class AuthGuard extends C.MiddlewareAbstract {
	constructor(
		private readonly service: AuthService,
		override readonly useOn: C.MiddlewareUseOn,
	) {
		super();
		this.register();
	}

	override handler: C.MiddlewareHandler = async (c) => {
		c.data.profile = await this.service.getProfile(c.headers);
	};
}
