import { X } from "@ozanarslan/corpus";
import log4js from "log4js";

const isDevelopment = X.Config.get("NODE_ENV", { fallback: "development" }) !== "production";

const registeredKeys = new Set<string>();

export function configureLogger(key: string, level: string) {
	registeredKeys.add(key);

	const appenders: Record<string, log4js.Appender> = {
		console: isDevelopment
			? { type: "console", layout: { type: "pattern", pattern: `[%c] [%p] [%d{ISO8601}]: %m` } }
			: { type: "console", layout: { type: "json" } },
	};

	const activeAppenders = ["console"];

	if (!isDevelopment) {
		appenders["errorFile"] = { type: "file", filename: "logs/error.log", layout: { type: "json" } };
		appenders["combinedFile"] = {
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
		if (!isDevelopment) {
			categories[`${k}_error`] = { appenders: ["errorFile"], level: "error" };
		}
	}

	log4js.configure({ appenders, categories });
}
