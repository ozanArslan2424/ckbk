import { X } from "@ozanarslan/corpus";
import { type } from "arktype";

import { ProfileEntity } from "@/Profile/ProfileEntity";

export type AuthType = X.InferModel<typeof AuthModel>;

export class AuthModel {
	private static readonly authResponse = type({
		profile: ProfileEntity.schema,
		accessToken: "string",
		refreshToken: "string",
	});

	static me = {
		response: ProfileEntity.schema,
	};

	static register = {
		body: type({
			name: "string > 1",
			email: "string.email",
			password: "string >= 8",
			language: "'tr'|'en'",
		}),
		response: type({ email: "string.email" }),
	};

	static login = {
		body: this.register.body.pick("email", "password"),
		response: this.authResponse,
	};

	static logout = {
		body: type({
			"refreshToken?": "string",
		}),
	};

	static refresh = {
		body: this.logout.body,
		response: this.authResponse.omit("profile"),
	};

	static verify = {
		body: type({
			email: "string.email",
			code: "string",
		}),
		response: this.authResponse,
	};
}
