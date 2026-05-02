import { C } from "@ozanarslan/corpus";

import type { JwtService } from "@/Jwt/JwtService";

export class JwtMiddleware extends C.MiddlewareAbstract {
	constructor(private readonly service: JwtService) {
		super();
		this.register();
	}
	override useOn: C.MiddlewareUseOn = "*";

	override handler: C.MiddlewareHandler = (c) => {
		const headerValue = c.headers.get(C.CommonHeaders.Authorization);
		const payload = this.service.getAccessPayload(headerValue);
		if (payload) c.data.jwtPayload = payload;
	};
}
