import { X } from "@ozanarslan/corpus";
import { type } from "arktype";

export type AuthType = X.InferModel<typeof AuthModel>;

export class AuthModel {
	private static readonly authResponse = type({
		accessToken: "string",
		refreshToken: "string",
	});

	static readonly register = {
		body: type({
			email: "string.email",
			password: "string >= 8",
		}),
		response: type({ email: "string.email" }),
	};

	static readonly login = {
		body: this.register.body.pick("email", "password"),
		response: this.authResponse,
	};

	static readonly logout = {
		body: type({
			"refreshToken?": "string",
		}),
	};

	static readonly refresh = {
		body: this.logout.body,
		response: this.authResponse,
	};

	static readonly verify = {
		body: type({
			email: "string.email",
			code: "string",
		}),
		response: this.authResponse,
	};
}
