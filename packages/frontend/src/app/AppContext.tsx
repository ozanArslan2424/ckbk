import { QueryClientProvider } from "@tanstack/react-query";
import { createContext, use, type PropsWithChildren } from "react";

import { AuthClient } from "@/app/Auth/AuthClient";
import { CookBookClient } from "@/app/Cookbook/CookbookClient";
import { IngredientClient } from "@/app/Ingredient/IngredientClient";
import { MaterialClient } from "@/app/Material/MaterialClient";
import { MeasurementClient } from "@/app/Measurement/MeasurementClient";
import { RecipeClient } from "@/app/Recipe/RecipeClient";
import { StepClient } from "@/app/Step/StepClient";
import { CorpusApi } from "@/lib/CorpusApi";
import { QueryClient } from "@/lib/QueryClient";
import { RequestClient } from "@/lib/RequestClient";
import { Store } from "@/lib/Store";
import localeConfig from "@/locale/localeConfig";

const languageHeader = "x-lang";
const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const refreshTokenKey = "refreshToken";

function makeContext() {
	const api = new CorpusApi(baseURL);

	const queryClient = new QueryClient();

	const store = new Store({ accessToken: null, auth: null });

	const request = new RequestClient({
		baseURL,
		refreshIgnoredEndpoints: [api.endpoints.authRefreshPost],
		onRefreshToken: async (instance) => {
			const res = await instance.post(api.endpoints.authRefreshPost, {
				refreshToken: sessionStorage.getItem(refreshTokenKey) ?? "",
			});
			sessionStorage.setItem(refreshTokenKey, res.data.refreshToken);
			return res.data.accessToken;
		},
		onBeforeRequest: (config) => {
			const lang = localeConfig.language;
			config.headers[languageHeader] = lang;
		},
		getAccessToken: () => store.get("accessToken"),
		setAccessToken: (value) => store.set("accessToken", value),
	});

	api.setFetchFn(async (d) => request.corpus(d));

	const authClient = new AuthClient(api, queryClient, store);
	const ingredientClient = new IngredientClient(api, queryClient);
	const materialClient = new MaterialClient(api, queryClient);
	const measurementClient = new MeasurementClient(api, queryClient);
	const recipeClient = new RecipeClient(api, queryClient);
	const stepClient = new StepClient(api, queryClient);
	const cookbookClient = new CookBookClient(api, queryClient);

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
		cookbookClient,
	};
}

const context = makeContext();

const AppContext = createContext<typeof context>(context);

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
