import "@ozanarslan/corpus";
import jwt from "jsonwebtoken";

import type { ProfileEntity } from "@/Profile/entities/ProfileEntity";

declare module "jsonwebtoken" {
	interface JwtPayload {
		userId: string;
		email: string;
	}
}

declare module "@ozanarslan/corpus" {
	interface Env {
		PORT: string;
		APP_NAME: string;
		BASE_URL: string;
		CLIENT_URL: string;
		DATABASE_URL: string;
		JWT_REFRESH_SECRET: string;
		JWT_ACCESS_SECRET: string;
		SEED_PWD: string;
		SMTP_FROM: string;
		SMTP_HOST: string;
		SMTP_PORT: string;
		SMTP_USER: string;
		SMTP_PASS: string;
		LOG_LEVEL: string;
	}
	export interface ContextDataInterface {
		locale: string;
		profile?: ProfileEntity;
		jwtPayload?: jwt.JwtPayload;
	}
}

export {};
