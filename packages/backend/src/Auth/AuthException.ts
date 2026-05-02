import { C } from "@ozanarslan/corpus";

export const AuthException = {
	unauthorized: new C.Exception("auth.unauthorized", C.Status.UNAUTHORIZED),
	invalid: new C.Exception("auth.invalid", C.Status.BAD_REQUEST),
	registerExists: new C.Exception("auth.registerExists", C.Status.BAD_REQUEST),
	invalidToken: new C.Exception("auth.invalidToken", C.Status.UNAUTHORIZED),
	reusedToken: new C.Exception("auth.reusedToken", C.Status.FORBIDDEN),
	verification: new C.Exception("auth.verification", C.Status.BAD_REQUEST),
	profileNotFound: new C.Exception("auth.profileNotFound", C.Status.UNAUTHORIZED),

	translations: {
		unauthorized: {
			"en-US": "Unrized",
			tr: "Yetkisiz erişim",
		},
		invalid: {
			"en-US": "Invalid credentials",
			tr: "Geçersiz bilgiler girdiniz",
		},
		invalidToken: {
			"en-US": "Invalid token",
			tr: "Geçersiz token",
		},
		reusedToken: {
			"en-US": "Security breach: Refresh token reused!",
			tr: "Güvenlik aşımı: Refresh token yeniden kullanıldı!",
		},
		verification: {
			"en-US": "Email verification failed",
			tr: "E-Posta doğrulaması başarısız oldu",
		},
		registerExists: {
			"en-US": "This email is already registered",
			tr: "Bu e-posta zaten kayıtlı",
		},
		profileNotFound: {
			"en-US": "Profile not found",
			tr: "Profil bulunamadı",
		},
	},
};
