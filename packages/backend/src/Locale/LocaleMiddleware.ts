import { C } from "@ozanarslan/corpus";

import type { LocaleService } from "@/Locale/LocaleService";

export class LocaleMiddleware extends C.MiddlewareAbstract {
	constructor(private readonly service: LocaleService) {
		super();
		this.register();
	}

	override useOn: C.MiddlewareUseOn = "*";
	override handler: C.MiddlewareHandler = (c) => {
		c.data.locale = this.service.getLocale(c.headers);
	};
}
