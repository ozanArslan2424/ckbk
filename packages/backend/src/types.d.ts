import "@ozanarslan/corpus";
import type { AuthType } from "@/Auth/AuthModel";

declare module "@ozanarslan/corpus" {
	interface Env {
		PORT: string;
		APP_NAME: string;
		BASE_URL: string;
		CLIENT_URL: string;
		DATABASE_URL: string;
		JWT_REFRESH_SECRET: string;
		JWT_ACCESS_SECRET: string;
		SMTP_FROM: string;
		SMTP_HOST: string;
		SMTP_PORT: string;
		SMTP_USER: string;
		SMTP_PASS: string;
		LOG_LEVEL: string;
	}
	interface ContextDataInterface {
		profile?: AuthType["me"]["response"];
	}
}

declare module "jsonwebtoken" {
	interface JwtPayload {
		userId: string;
	}
}

export {};
