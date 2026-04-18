import { QueryClientProvider } from "@tanstack/react-query";
import { createContext, use, type PropsWithChildren } from "react";

import { AuthClient } from "@/Api/AuthClient";
import { CorpusApi } from "@/Api/CorpusApi";
import { IngredientClient } from "@/Api/IngredientClient";
import { MaterialClient } from "@/Api/MaterialClient";
import { MeasurementClient } from "@/Api/MeasurementClient";
import { RequestClient } from "@/Api/RequestClient";
import { StepClient } from "@/Api/StepClient";
import { Store } from "@/Api/Store";
import { RecipeClient } from "@/App/Recipe/RecipeClient";
import localeConfig from "@/lib/Locale/localeConfig";
import { QueryClient } from "@/Query/QueryClient";
import { queryConfig } from "@/Query/queryConfig";

const languageHeader = "x-lang";
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const refreshTokenKey = "refreshToken";

function makeContext() {
	const queryClient = new QueryClient(queryConfig);

	const store = new Store({
		accessToken: null,
		auth: null,
	});

	const api = new CorpusApi(baseURL);

	const request = new RequestClient(store, {
		baseURL,
		refreshIgnoredEndpoints: [api.endpoints.authRefreshPost],
		refreshCallback: async (instance) => {
			const res = await instance.post(api.endpoints.authRefreshPost, {
				refreshToken: sessionStorage.getItem(refreshTokenKey) ?? "",
			});
			sessionStorage.setItem(refreshTokenKey, res.data.refreshToken);
			return res.data.accessToken;
		},
		beforeRequest: (config) => {
			const lang = localeConfig.language;
			config.headers[languageHeader] = lang;
		},
	});

	api.setFetchFn((d) => request.corpus(d));

	const authClient = new AuthClient(queryClient, api, store);
	const ingredientClient = new IngredientClient(queryClient, api);
	const materialClient = new MaterialClient(queryClient, api);
	const measurementClient = new MeasurementClient(queryClient, api);
	const recipeClient = new RecipeClient(queryClient, api);
	const stepClient = new StepClient(queryClient, api);

	return {
		api,
		store,
		queryClient,
		authClient,
		ingredientClient,
		materialClient,
		measurementClient,
		recipeClient,
		stepClient,
	};
}

const context = makeContext();

const AppContext = createContext<typeof context>(context);

export function useAppContext() {
	const value = use(AppContext);
	if (!value) throw new Error("AppContext requires a provider.");
	return value;
}

export function AppContextProvider({ children }: PropsWithChildren) {
	return (
		<QueryClientProvider client={context.queryClient}>
			<AppContext value={context}>{children}</AppContext>
		</QueryClientProvider>
	);
}
