import { C } from "@ozanarslan/corpus";

import { Logger } from "@/Logger/Logger";

export class LoggerMiddleware extends C.MiddlewareAbstract {
	constructor() {
		super();
		this.register();
	}

	private readonly logger = new Logger("Request");

	override useOn: C.MiddlewareUseOn = "*";
	override handler: C.MiddlewareHandler = (c) => {
		this.logger.log(`[${c.req.method}] ${c.url.pathname}`);
	};
}
