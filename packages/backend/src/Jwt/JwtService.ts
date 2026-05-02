import { X } from "@ozanarslan/corpus";
import jwt from "jsonwebtoken";

import { AuthException } from "@/Auth/AuthException";
import type { DatabaseClient } from "@/Database/DatabaseClient";
import type { TransactionClient } from "@/Database/DatabaseTypes";
import { Logger } from "@/Logger/Logger";

export class JwtService {
	constructor(private readonly db: DatabaseClient) {}

	private readonly logger = new Logger(this.constructor.name);

	private readonly jwtRefreshSecret = X.Config.get("JWT_REFRESH_SECRET");
	private readonly jwtAccessSecret = X.Config.get("JWT_ACCESS_SECRET");
	private readonly refreshExpireMs = 7 * 24 * 60 * 60 * 1000; // 1 week
	private readonly cleanupIntervalMs = 60 * 60 * 1000; // 1 hour
	private cleanupTimer: Timer | null = null;

	getAccessPayload(headerValue: string | null): jwt.JwtPayload | null {
		if (!headerValue) return null;
		const [scheme, token] = headerValue.split(" ");
		if (scheme !== "Bearer") return null;
		if (!token) return null;
		try {
			return jwt.verify(token, this.jwtAccessSecret) as jwt.JwtPayload;
		} catch {
			return null;
		}
	}

	signRefreshToken(jti: string, userId: string) {
		const refreshToken = jwt.sign({ userId, jti }, this.jwtRefreshSecret, {
			expiresIn: "7d",
		});
		return refreshToken;
	}

	getRefreshPayload(refreshToken: string | undefined): jwt.JwtPayload {
		if (!refreshToken) {
			throw AuthException.unauthorized;
		}
		try {
			return jwt.verify(refreshToken, this.jwtRefreshSecret) as jwt.JwtPayload;
		} catch {
			throw AuthException.invalidToken;
		}
	}

	signAccessToken(userId: string, email: string) {
		return jwt.sign({ userId, email }, this.jwtAccessSecret, { expiresIn: "15m" });
	}

	async createRefreshToken(userId: string, tx?: TransactionClient) {
		const client = tx ?? this.db;
		const token = await client.refreshToken.create({
			data: { userId, expiresAt: new Date(Date.now() + this.refreshExpireMs), isValid: true },
			select: { id: true },
		});
		return token.id;
	}

	// Token'ı silmek yerine geçersiz kılıyoruz (Audit ve Reuse Detection için)
	async invalidateRefreshToken(id: string, tx?: TransactionClient) {
		const client = tx ?? this.db;
		await client.refreshToken.update({
			where: { id },
			data: { isValid: false },
		});
	}

	// Acil durum: Kullanıcının tüm oturumlarını kapat
	async invalidateAllTokensForUser(userId: string, tx?: TransactionClient) {
		const client = tx ?? this.db;
		await client.refreshToken.updateMany({
			where: { userId, isValid: true },
			data: { isValid: false },
		});
	}

	// Periyodik temizlik (Sadece DB şişmesin diye)
	async deleteExpiredTokens(tx?: TransactionClient) {
		const client = tx ?? this.db;
		const result = await client.refreshToken.deleteMany({
			where: {
				OR: [{ expiresAt: { lt: new Date() } }, { isValid: false }],
			},
		});
		this.logger.log(`Deleted ${result.count} expired/invalid refresh tokens`);
	}

	startCleanupSchedule() {
		if (this.cleanupTimer) return;
		this.logger.log(`Starting token cleanup schedule (every ${this.cleanupIntervalMs / 60000}m)`);
		this.cleanupTimer = setInterval(() => {
			this.logger.log("Running token cleanup");
			void this.deleteExpiredTokens().catch((err) =>
				this.logger.error("Token cleanup failed", err),
			);
		}, this.cleanupIntervalMs);
	}

	stopCleanupSchedule() {
		if (!this.cleanupTimer) return;
		this.logger.log("Stopping token cleanup schedule");
		clearInterval(this.cleanupTimer);
		this.cleanupTimer = null;
	}
}
