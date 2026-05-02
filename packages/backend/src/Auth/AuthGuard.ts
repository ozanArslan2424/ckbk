import { C } from "@ozanarslan/corpus";

import { AuthException } from "@/Auth/AuthException";
import type { ProfileService } from "@/Profile/ProfileService";

export class AuthGuard extends C.MiddlewareAbstract {
	constructor(
		private readonly service: ProfileService,
		override readonly useOn: C.MiddlewareUseOn,
	) {
		super();
		this.register();
	}

	override handler: C.MiddlewareHandler = async (c) => {
		if (!c.data.jwtPayload) throw AuthException.unauthorized;
		c.data.profile ??= await this.service.get(c.data.jwtPayload.userId);
	};
}
