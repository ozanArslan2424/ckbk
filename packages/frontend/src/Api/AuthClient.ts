import type { CorpusApi, Args, Models } from "@/Api/CorpusApi";
import type { Store } from "@/Api/Store";
import type { QueryClient } from "@/Query/QueryClient";
import type { MakeMutArgs } from "@/Query/QueryTypes";
import { routes } from "@/router";

export class AuthClient {
	constructor(
		private readonly query: QueryClient,
		private readonly api: CorpusApi,
		private readonly store: Store,
	) {}

	private setAuthenticatedData(accessToken: string | null, refreshToken: string | null) {
		this.store.set("accessToken", accessToken);
		if (refreshToken) {
			sessionStorage.setItem("refreshToken", refreshToken);
		} else {
			sessionStorage.removeItem("refreshToken");
		}
	}

	queryMe(args: Args.AuthMeGet) {
		return this.query.makeQuery({
			queryKey: [this.api.endpoints.authMeGet],
			queryFn: () => this.api.authMeGet(args),
		});
	}

	login(opts?: MakeMutArgs<Models.AuthLoginPost>) {
		return this.query.makeMutation<Models.AuthLoginPost>({
			...opts,
			mutationFn: (vars) => this.api.authLoginPost(vars),
			onSuccess: (res, vars, ...rest) => {
				this.setAuthenticatedData(res.accessToken, res.refreshToken);
				this.query.clear();
				opts?.onSuccess?.(res, vars, ...rest);
			},
		});
	}

	register(opts?: MakeMutArgs<Models.AuthRegisterPost>) {
		return this.query.makeMutation<Models.AuthRegisterPost>({
			...opts,
			mutationFn: (args) => this.api.authRegisterPost(args),
		});
	}

	verify(opts?: MakeMutArgs<Models.AuthVerifyPost>) {
		return this.query.makeMutation<Models.AuthVerifyPost>({
			...opts,
			mutationFn: (vars) => this.api.authVerifyPost(vars),
			onSuccess: (res, vars, ...rest) => {
				this.setAuthenticatedData(res.accessToken, res.refreshToken);
				this.query.clear();
				opts?.onSuccess?.(res, vars, ...rest);
			},
		});
	}

	logout(opts?: MakeMutArgs<Models.AuthLogoutPost>) {
		return this.query.makeMutation<Models.AuthLogoutPost>({
			mutationFn: () =>
				this.api.authLogoutPost({
					body: {
						refreshToken: sessionStorage.getItem("refreshToken") ?? undefined,
					},
				}),
			...opts,
			onSuccess: (res, vars, ...rest) => {
				window.location.href = routes.landing;
				this.setAuthenticatedData(null, null);
				this.query.clear();
				opts?.onSuccess?.(res, vars, ...rest);
			},
		});
	}
}
