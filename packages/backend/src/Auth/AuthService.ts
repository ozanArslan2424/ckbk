import { X } from "@ozanarslan/corpus";

import { AuthException } from "@/Auth/AuthException";
import type { AuthType } from "@/Auth/AuthModel";
import type { DatabaseClient } from "@/Database/DatabaseClient";
import type { TransactionClient } from "@/Database/DatabaseTypes";
import type { JwtService } from "@/Jwt/JwtService";
import type { MailService } from "@/Mail/MailService";
import { ProfileEntity } from "@/Profile/entities/ProfileEntity";

export class AuthService {
	private readonly verificationExpireMs = 60 * 60 * 1000; // 1 hour

	constructor(
		private readonly db: DatabaseClient,
		private readonly mailService: MailService,
		private readonly jwtService: JwtService,
	) {}

	async findByEmail(email: string, tx?: TransactionClient) {
		const client = tx ?? this.db;
		return client.user.findUnique({ where: { email } });
	}

	async login(body: AuthType["login"]["body"]) {
		const user = await this.findByEmail(body.email);
		if (!user) {
			throw AuthException.invalid;
		}

		const pwdMatch = await this.verifyPassword(body.password, user.password);
		if (!pwdMatch) {
			throw AuthException.invalid;
		}

		const profileRaw = await this.db.profile.findUnique({ where: { userId: user.id } });
		if (!profileRaw) {
			throw AuthException.invalid;
		}

		const profile = new ProfileEntity(profileRaw);
		const jti = await this.jwtService.createRefreshToken(user.id);
		const refreshToken = this.jwtService.signRefreshToken(jti, user.id);
		const accessToken = this.jwtService.signAccessToken(user.id, user.email);
		return { profile, accessToken, refreshToken };
	}

	async register(body: AuthType["register"]["body"], locale: string) {
		const email = body.email;

		const exists = await this.findByEmail(email);
		if (exists) {
			throw AuthException.registerExists;
		}

		const appName = X.Config.get("APP_NAME");
		const verificationExpiresAt = new Date(Date.now() + this.verificationExpireMs);
		const otpCode = this.generateOTP();
		console.log(otpCode);

		await this.db.user.create({
			data: {
				email,
				password: await this.hashPassword(body.password),
				lastActive: new Date(),
				verifications: {
					create: { expiresAt: verificationExpiresAt, value: otpCode, variant: "email" },
				},
			},
		});

		void this.mailService.sendMail(locale, {
			toEmail: email,
			translator: "verification",
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

			const jti = await this.jwtService.createRefreshToken(user.id, tx);
			const refreshToken = this.jwtService.signRefreshToken(jti, user.id);
			const accessToken = this.jwtService.signAccessToken(user.id, user.email);
			return { accessToken, refreshToken };
		});

		if (!response) {
			throw AuthException.verification;
		}

		return response;
	}

	async refresh(body: AuthType["refresh"]["body"]) {
		const payload = this.jwtService.getRefreshPayload(body.refreshToken);
		// SENARYO A: Alakasız bir token kullanıldıysa hata mesajı yeterli.
		if (!payload.jti) {
			throw AuthException.invalidToken;
		}

		const token = await this.db.refreshToken.findUnique({
			where: { id: payload.jti },
			include: { user: true },
		});

		// SENARYO B: Token veritabanında hiç yok (Silinmiş veya hiç oluşmamış)
		// Bu durumda paniğe gerek yok, kullanıcının tekrar giriş yapması lazım.
		if (!token) {
			throw AuthException.invalidToken;
		}

		// SENARYO C: Panik.
		// Token veritabanında var ama geçersiz. Token geçersizse çalınmış olabilir, kullanıcının bütün oturumlarını invalide etmeliyiz.
		if (!token.isValid) {
			await this.jwtService.invalidateAllTokensForUser(payload.userId);
			throw AuthException.reusedToken;
		}

		// SENARYO D: Her şey yolunda, mevcut token'ı kullanılmış işaretleyip yenisini
		// gönderebiliriz. (rotation)
		await this.jwtService.invalidateRefreshToken(payload.jti);
		const jti = await this.jwtService.createRefreshToken(token.user.id);
		const refreshToken = this.jwtService.signRefreshToken(jti, token.user.id);
		const accessToken = this.jwtService.signAccessToken(token.user.id, token.user.email);

		return { accessToken, refreshToken };
	}

	async logout(body: AuthType["logout"]["body"]) {
		try {
			const payload = this.jwtService.getRefreshPayload(body.refreshToken);
			if (!payload.jti) return;
			await this.jwtService.invalidateRefreshToken(payload.jti);
		} catch {
			// already invalid do nothing
		}
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
