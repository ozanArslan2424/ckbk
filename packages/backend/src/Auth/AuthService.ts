import { C, X } from "@ozanarslan/corpus";
import jwt from "jsonwebtoken";

import type { AuthType } from "@/Auth/AuthModel";
import type { DatabaseClient } from "@/Database/DatabaseClient";
import type { TransactionClient } from "@/Database/DatabaseTypes";
import type { MailService } from "@/Mail/MailService";
import { ProfileEntity } from "@/Profile/ProfileEntity";

export class AuthService {
	readonly jwtRefreshSecret = X.Config.get("JWT_REFRESH_SECRET");
	readonly jwtAccessSecret = X.Config.get("JWT_ACCESS_SECRET");
	readonly authHeader = "authorization";
	readonly verificationExpireMs = 60 * 60 * 1000; // 1 hour
	readonly refreshExpireMs = 7 * 24 * 60 * 60 * 1000; // 7 days

	constructor(
		private readonly db: DatabaseClient,
		private readonly mailService: MailService,
	) {}

	async getProfile(headers: C.Headers, tx?: TransactionClient) {
		const payload = this.getAccessPayload(headers);
		const client = tx ?? this.db;
		const user = await client.user.findUnique({
			where: { id: payload.userId },
			include: { profile: true },
		});

		if (!user?.profile) {
			console.log("!user");
			throw new C.Exception("UNAUTHORIZED", C.Status.UNAUTHORIZED);
		}
		return new ProfileEntity({ ...user.profile, emailVerified: user.emailVerified });
	}

	async findByEmail(email: string, tx?: TransactionClient) {
		const client = tx ?? this.db;
		return client.user.findUnique({ where: { email } });
	}

	async login(body: AuthType["login"]["body"]) {
		const user = await this.findByEmail(body.email);
		if (!user) {
			throw new C.Exception("auth.invalid", C.Status.BAD_REQUEST);
		}

		const pwdMatch = await this.verifyPassword(body.password, user.password);
		if (!pwdMatch) {
			throw new C.Exception("auth.invalid", C.Status.BAD_REQUEST);
		}

		const profileRaw = await this.db.profile.findUnique({ where: { userId: user.id } });
		if (!profileRaw) {
			throw new C.Exception("auth.invalid", C.Status.BAD_REQUEST);
		}

		const profile = new ProfileEntity(profileRaw);
		const jti = await this.createRefreshToken(user.id);
		const refreshToken = this.signRefreshToken(jti, user.id);
		const accessToken = this.signAccessToken(profileRaw.userId);
		return { profile, accessToken, refreshToken };
	}

	async register(body: AuthType["register"]["body"]) {
		const email = body.email;
		const name = body.name;

		const exists = await this.findByEmail(email);
		if (exists) {
			throw new C.Exception("auth.registerExists", C.Status.BAD_REQUEST);
		}

		const otpCode = await this.db.$transaction(async (tx) => {
			const password = await this.hashPassword(body.password);

			const verificationExpiresAt = new Date(Date.now() + this.verificationExpireMs);
			const otpCode = this.generateOTP();

			const user = await tx.user.create({ data: { email, password, lastActive: new Date() } });

			await tx.verification.create({
				data: {
					expiresAt: verificationExpiresAt,
					value: otpCode,
					variant: "email",
					userId: user.id,
				},
			});

			await tx.profile.create({ data: { userId: user.id, email, name } });
			return otpCode;
		});

		const appName = X.Config.get("APP_NAME");
		await this.mailService.sendMail({
			toEmail: email,
			toName: name,
			translator: "auth",
			subject: (t) => t("subject", { appName }),
			variables: (t) => ({
				appName,
				subject: t("subject", { appName }),
				title: t("title"),
				description: t("description"),
				otpTitle: t("otpTitle"),
				otpExpire: t("otpExpire"),
				otpCode,
				notMe: t("notMe"),
				rights: t("rights", { appName }),
			}),
			htmlTemplateName: "otp.html",
			textTemplateName: "otp.txt",
		});
	}

	async verify(body: AuthType["verify"]["body"]) {
		const response = await this.db.$transaction(async (tx) => {
			const email = body.email;
			const otpCode = body.code;

			const user = await this.findByEmail(email, tx);
			if (!user) {
				return null;
			}
			const whereToken = { userId_value: { userId: user.id, value: otpCode } };

			const verification = await tx.verification.findUnique({ where: whereToken });
			if (!verification) {
				return null;
			}

			if (verification.expiresAt.getTime() < Date.now()) {
				await tx.verification.delete({ where: whereToken });
				return null;
			}

			await tx.user.update({ where: { id: user.id }, data: { emailVerified: true } });
			await tx.verification.delete({ where: whereToken });

			let profileRaw = await tx.profile.findUnique({ where: { email } });
			profileRaw ??= await tx.profile.create({
				data: { userId: user.id, email, name: email.split("@")[0] ?? email },
			});
			const profile = new ProfileEntity({ ...profileRaw, emailVerified: true });

			const jti = await this.createRefreshToken(user.id, tx);
			const refreshToken = this.signRefreshToken(jti, user.id);
			const accessToken = this.signAccessToken(profileRaw.userId);
			return { profile, accessToken, refreshToken };
		});

		if (!response) {
			throw new C.Exception("auth.verification", C.Status.BAD_REQUEST);
		}

		return response;
	}

	async refresh(body: AuthType["refresh"]["body"]) {
		const payload = this.getRefreshPayload(body.refreshToken);
		// SENARYO A: Alakasız bir token kullanıldıysa hata mesajı yeterli.
		if (!payload.jti) {
			throw new C.Exception("Invalid refresh token", C.Status.BAD_REQUEST);
		}
		const tokenRecord = await this.db.refreshToken.findUnique({
			where: { id: payload.jti },
			include: { user: true },
		});

		// SENARYO B: Token veritabanında hiç yok (Silinmiş veya hiç oluşmamış)
		// Bu durumda paniğe gerek yok, kullanıcının tekrar giriş yapması lazım.
		if (!tokenRecord) {
			throw new C.Exception("Invalid refresh token", C.Status.UNAUTHORIZED);
		}

		// SENARYO C: Panik.
		// Token veritabanında var ama geçersiz. Token geçersizse çalınmış olabilir, kullanıcının bütün oturumlarını invalide etmeliyiz.
		if (!tokenRecord.isValid) {
			await this.invalidateAllTokensForUser(payload.userId);
			throw new C.Exception("Security breach: Refresh token reused!", C.Status.FORBIDDEN);
		}

		// SENARYO D: Her şey yolunda, mevcut token'ı kullanılmış işaretleyip yenisini
		// gönderebiliriz. (rotation)
		return this.db.$transaction(async (tx) => {
			if (!payload.jti) {
				throw new C.Exception("Invalid refresh token", C.Status.BAD_REQUEST);
			}

			await this.invalidateRefreshToken(payload.jti, payload.userId, tx);
			const jti = await this.createRefreshToken(tokenRecord.userId, tx);
			const refreshToken = this.signRefreshToken(jti, tokenRecord.userId);
			const accessToken = this.signAccessToken(tokenRecord.userId);

			return { accessToken, refreshToken };
		});
	}

	async logout(body: AuthType["logout"]["body"]) {
		try {
			const payload = this.getRefreshPayload(body.refreshToken);
			if (!payload.jti) return;
			await this.invalidateRefreshToken(payload.jti, payload.userId);
		} catch {
			// already invalid do nothing
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
			console.log("!refreshToken");
			throw new C.Exception("UNAUTHORIZED", C.Status.UNAUTHORIZED);
		}
		try {
			return jwt.verify(refreshToken, this.jwtRefreshSecret) as jwt.JwtPayload;
		} catch {
			throw new C.Exception("Invalid refresh token", C.Status.BAD_REQUEST);
		}
	}

	signAccessToken(userId: string) {
		return jwt.sign({ userId }, this.jwtAccessSecret, { expiresIn: "15m" });
	}

	getAccessToken(headers: C.Headers): string | null {
		const authHeader = headers.get(this.authHeader);
		if (!authHeader) return null;
		const token = authHeader.split(" ")[1];
		return token ?? null;
	}

	getAccessPayload(headers: C.Headers): jwt.JwtPayload {
		const token = this.getAccessToken(headers);
		if (!token) {
			console.log("!token");
			throw new C.Exception("UNAUTHORIZED", C.Status.UNAUTHORIZED);
		}
		try {
			return jwt.verify(token, this.jwtAccessSecret) as jwt.JwtPayload;
		} catch (err) {
			console.log(err);
			throw new C.Exception("Invalid access token", C.Status.UNAUTHORIZED);
		}
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
	async invalidateRefreshToken(id: string, userId: string, tx?: TransactionClient) {
		const client = tx ?? this.db;
		await client.refreshToken.update({
			where: { id, userId },
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
		await client.refreshToken.deleteMany({
			where: {
				OR: [{ expiresAt: { lt: new Date() } }, { isValid: false }],
			},
		});
	}

	private async hashPassword(password: string) {
		return Bun.password.hash(password);
	}

	private async verifyPassword(password: string, hashedPassword: string) {
		return Bun.password.verify(password, hashedPassword);
	}

	private generateOTP(): string {
		const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		let otp = "";
		for (let i = 0; i < 6; i++) {
			otp += chars[Math.floor(Math.random() * chars.length)];
		}
		return otp;
	}
}
