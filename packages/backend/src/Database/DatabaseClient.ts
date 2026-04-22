import { X } from "@ozanarslan/corpus";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "prisma/generated/client";

import { Logger } from "@/Logger/Logger";

export class DatabaseClient extends PrismaClient {
	private readonly logger = new Logger("Database");

	constructor() {
		const url = X.Config.get("DATABASE_URL");
		super({ adapter: new PrismaLibSql({ url }) });
	}

	async connect(): Promise<void> {
		const maxAttempts = 3;
		const baseDelay = 1000; // 1 second

		for (let attempt = 1; attempt <= maxAttempts; attempt++) {
			try {
				await this.$connect();
				this.logger.log("✅ DB Client Connected");
				return;
			} catch (err) {
				const error = err as Error;
				this.logger.warn(
					`❌ DB Connection attempt ${attempt}/${maxAttempts} failed: ${error.message}`,
				);

				if (attempt === maxAttempts) {
					throw new Error(
						`Failed to connect to database after ${maxAttempts} attempts: ${error.message}`,
					);
				}

				const delay = baseDelay * Math.pow(2, attempt - 1);
				this.logger.log(`Retrying in ${delay}ms...`);
				await new Promise((resolve) => {
					setTimeout(resolve, delay);
				});
			}
		}
	}

	async disconnect(): Promise<void> {
		await this.$disconnect();
		this.logger.log("❌ DB Client Disconnected");
	}

	convertToSkipTake(page: number, limit: number): { skip: number; take: number } {
		return { skip: (page - 1) * limit, take: limit };
	}

	whereIn<K extends string, T, Arr extends Array<T>>(key: K, arr: Arr) {
		return arr.length ? { [key]: { in: arr } } : undefined;
	}

	whereAnd<W extends { AND?: unknown }>(
		where: W,
		...and: Array<W extends { AND?: (infer A)[] | (infer _) } ? A : never>
	) {
		if (!where.AND || !Array.isArray(where.AND)) where.AND = [];
		(where.AND as any[]).push(...and);
	}
}
