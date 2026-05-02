import { QueryClientProvider } from "@tanstack/react-query";
import { createContext, use, type PropsWithChildren } from "react";

import { AuthClient } from "@/app/Auth/AuthClient";
import { CookbookClient } from "@/app/Cookbook/CookbookClient";
import { IngredientClient } from "@/app/Ingredient/IngredientClient";
import { MaterialClient } from "@/app/Material/MaterialClient";
import { MeasurementClient } from "@/app/Measurement/MeasurementClient";
import { ProfileClient } from "@/app/Profile/ProfileClient";
import { RecipeClient } from "@/app/Recipe/RecipeClient";
import { StepClient } from "@/app/Step/StepClient";
import { CorpusApi, type Models } from "@/lib/CorpusApi";
import { QueryClient } from "@/lib/QueryClient";
import { RequestClient } from "@/lib/RequestClient";
import { MemoryStore, WebStore } from "@/lib/SimpleStore";
import { Store } from "@/lib/Store";
import { Locale } from "@/locale/Locale";

const languageHeader = "x-lang";
const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

function makeContext() {
	const locale = new Locale("tr");

	const store = new Store({ auth: null, locale: locale.initial });

	locale.subscribe(store);

	const accessTokenStore = new MemoryStore<string>();

	const refreshTokenStore = new WebStore(sessionStorage, "refreshToken");

	const api = new CorpusApi(baseURL);

	const request = new RequestClient({
		baseURL,
		accessTokenStore,
		refreshIgnoredEndpoints: [api.endpoints.authRefreshPost],
		onTokenRefresh: async (ins) => {
			const refreshToken = refreshTokenStore.get();
			if (!refreshToken) {
				throw new Error("No refresh token");
			}
			const res = await ins.post<Models.AuthRefreshPost["response"]>(
				api.endpoints.authRefreshPost,
				{ refreshToken },
			);
			refreshTokenStore.set(res.data.refreshToken);
			return res.data.accessToken;
		},
		onBeforeRequest: (config) => {
			config.headers[languageHeader] = store.get("locale");
		},
	});

	api.setFetchFn((desc) => request.corpus(desc));

	const queryClient = new QueryClient();

	const authClient = new AuthClient(api, queryClient, accessTokenStore, refreshTokenStore);
	const profileClient = new ProfileClient(api, queryClient, store);
	const ingredientClient = new IngredientClient(api, queryClient);
	const materialClient = new MaterialClient(api, queryClient);
	const measurementClient = new MeasurementClient(api, queryClient);
	const recipeClient = new RecipeClient(api, queryClient);
	const stepClient = new StepClient(api, queryClient);
	const cookbookClient = new CookbookClient(api, queryClient);

	return {
		api,
		store,
		queryClient,
		authClient,
		profileClient,
		ingredientClient,
		materialClient,
		measurementClient,
		recipeClient,
		stepClient,
		cookbookClient,
	};
}

const context = makeContext();

const AppContext = createContext<typeof context>(context);

export function getAppContext() {
	return context;
}

export function useAppContext() {
	return use(AppContext);
}

export function AppContextProvider({ children }: PropsWithChildren) {
	return (
		<QueryClientProvider client={context.queryClient}>
			<AppContext value={context}>{children}</AppContext>
		</QueryClientProvider>
	);
}
