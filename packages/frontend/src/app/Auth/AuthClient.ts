import type { CorpusApi, Models } from "@/lib/CorpusApi";
import type { MutArgs, QueryClient } from "@/lib/QueryClient";
import type { SimpleStore } from "@/lib/SimpleStore";
import { routes } from "@/router";

export class AuthClient {
	constructor(
		private readonly api: CorpusApi,
		private readonly queryClient: QueryClient,
		private readonly accessTokenStore: SimpleStore<string>,
		private readonly refreshTokenStore: SimpleStore<string>,
	) {}

	private setAuthenticatedData(accessToken: string | null, refreshToken: string | null) {
		this.accessTokenStore.set(accessToken);
		this.refreshTokenStore.set(refreshToken);
	}

	async ensureAccessToken() {
		const accessToken = this.accessTokenStore.get();
		const refreshToken = this.refreshTokenStore.get();
		if (!accessToken && refreshToken) {
			const res = await this.api.authRefreshPost({ body: { refreshToken } });
			this.setAuthenticatedData(res.accessToken, res.refreshToken);
		}
	}

	login(opts?: MutArgs<Models.AuthLoginPost>) {
		return this.queryClient.makeMutation<Models.AuthLoginPost>({
			...opts,
			mutationFn: async (vars) => this.api.authLoginPost(vars),
			onSuccess: (res, vars, ...rest) => {
				this.setAuthenticatedData(res.accessToken, res.refreshToken);
				this.queryClient.clear();
				opts?.onSuccess?.(res, vars, ...rest);
			},
		});
	}

	register(opts?: MutArgs<Models.AuthRegisterPost>) {
		return this.queryClient.makeMutation<Models.AuthRegisterPost>({
			...opts,
			mutationFn: async (args) => this.api.authRegisterPost(args),
		});
	}

	verify(opts?: MutArgs<Models.AuthVerifyPost>) {
		return this.queryClient.makeMutation<Models.AuthVerifyPost>({
			...opts,
			mutationFn: async (vars) => this.api.authVerifyPost(vars),
			onSuccess: (res, vars, ...rest) => {
				this.setAuthenticatedData(res.accessToken, res.refreshToken);
				this.queryClient.clear();
				opts?.onSuccess?.(res, vars, ...rest);
			},
		});
	}

	logout(opts?: MutArgs<Models.AuthLogoutPost>) {
		return this.queryClient.makeMutation<Models.AuthLogoutPost>({
			mutationFn: async () =>
				this.api.authLogoutPost({
					body: {
						refreshToken: sessionStorage.getItem("refreshToken") ?? undefined,
					},
				}),
			...opts,
			onSuccess: (res, vars, ...rest) => {
				window.location.href = routes.landing;
				this.setAuthenticatedData(null, null);
				this.queryClient.clear();
				opts?.onSuccess?.(res, vars, ...rest);
			},
		});
	}
}
