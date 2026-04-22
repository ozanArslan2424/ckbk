import { X } from "@ozanarslan/corpus";
import log4js, { type Logger as Log4jsLogger } from "log4js";

import { configureLogger } from "@/Logger/configureLogger";

export class Logger {
	private readonly logLevel = X.Config.get("LOG_LEVEL", { fallback: "info" });
	private readonly logger: Log4jsLogger;

	constructor(key: string, loggerEnabled?: boolean) {
		configureLogger(key, loggerEnabled === false ? "off" : this.logLevel);
		this.logger = log4js.getLogger(key);
	}

	error(msg: string, ...args: any[]) {
		this.logger.error(msg, ...args);
	}
	warn(msg: string, ...args: any[]) {
		this.logger.warn(msg, ...args);
	}
	log(msg: string, ...args: any[]) {
		this.logger.info(msg, ...args);
	}
	debug(msg: string, ...args: any[]) {
		this.logger.debug(msg, ...args);
	}
}
