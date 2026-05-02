import { X } from "@ozanarslan/corpus";
import log4js, { type Logger as Log4jsLogger } from "log4js";

const registeredKeys = new Set<string>();

export class Logger {
	private readonly isDev = X.Config.nodeEnv !== "production";
	private readonly logLevel = X.Config.get("LOG_LEVEL", { fallback: "info" });
	private readonly logger: Log4jsLogger;

	constructor(key: string, loggerEnabled?: boolean) {
		this.configureLogger(key, loggerEnabled === false ? "off" : this.logLevel);
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

	private configureLogger(key: string, level: string) {
		registeredKeys.add(key);

		const appenders: Record<string, log4js.Appender> = {
			console: this.isDev
				? { type: "console", layout: { type: "pattern", pattern: `[%c] [%p] [%d{ISO8601}]: %m` } }
				: { type: "console", layout: { type: "json" } },
		};

		const activeAppenders = ["console"];

		if (!this.isDev) {
			appenders.errorFile = { type: "file", filename: "logs/error.log", layout: { type: "json" } };
			appenders.combinedFile = {
				type: "file",
				filename: "logs/combined.log",
				layout: { type: "json" },
			};
			activeAppenders.push("combinedFile");
		}

		const categories: log4js.Configuration["categories"] = {
			default: { appenders: activeAppenders, level },
		};

		for (const k of registeredKeys) {
			categories[k] = { appenders: activeAppenders, level };
			if (!this.isDev) {
				categories[`${k}_error`] = { appenders: ["errorFile"], level: "error" };
			}
		}

		log4js.configure({ appenders, categories });
	}
}
