type _Prim = string | number | boolean;

type Prettify<T> = { [K in keyof T]: T[K] } & {};

type ExtractArgs<T> = (Omit<T, "response"> extends infer U
	? { [K in keyof U as U[K] extends undefined ? never : K]: U[K] }
	: never) & {
	headers?: HeadersInit;
	init?: RequestInit;
};

interface RequestDescriptor {
	endpoint: string;
	method: string;
	body?: unknown;
	search?: Record<string, unknown>;
	headers?: HeadersInit;
	init?: Omit<RequestInit, "headers">;
}

namespace Entities {
	export type Profile = {
		createdAt: string;
		email: string;
		id: number;
		image: string | null;
		name: string;
		updatedAt: string;
		emailVerified?: boolean;
	};
	export const Profile = class {
		constructor(values: Profile) {
			Object.assign(this, values);
		}
	} as unknown as new (values: Profile) => Profile;
	export type Ingredient = {
		createdAt: string;
		id: number;
		material: string;
		materialId: number;
		measurement: string;
		measurementId: number;
		quantity: number;
		recipeId: number | null;
		updatedAt: string;
	};
	export const Ingredient = class {
		constructor(values: Ingredient) {
			Object.assign(this, values);
		}
	} as unknown as new (values: Ingredient) => Ingredient;
	export type Recipe = {
		createdAt: string;
		description: string;
		id: number;
		image: string | null;
		isPublic: boolean;
		profileId: number;
		title: string;
		updatedAt: string;
		likeCount?: number;
		isLiked?: boolean;
	};
	export const Recipe = class {
		constructor(values: Recipe) {
			Object.assign(this, values);
		}
	} as unknown as new (values: Recipe) => Recipe;
	export type Step = {
		body: string;
		createdAt: string;
		id: number;
		order: number;
		recipeId: number;
		updatedAt: string;
	};
	export const Step = class {
		constructor(values: Step) {
			Object.assign(this, values);
		}
	} as unknown as new (values: Step) => Step;
	export type Cookbook = {
		createdAt: string;
		description: string;
		id: number;
		image: string | null;
		ingredients: {
			createdAt: string;
			id: number;
			material: string;
			materialId: number;
			measurement: string;
			measurementId: number;
			quantity: number;
			recipeId: number | null;
			updatedAt: string;
		}[];
		isPublic: boolean;
		profileId: number;
		steps: {
			body: string;
			createdAt: string;
			id: number;
			order: number;
			recipeId: number;
			updatedAt: string;
		}[];
		title: string;
		updatedAt: string;
		likeCount?: number;
		isLiked?: boolean;
	};
	export const Cookbook = class {
		constructor(values: Cookbook) {
			Object.assign(this, values);
		}
	} as unknown as new (values: Cookbook) => Cookbook;
	export type Material = {
		createdAt: string;
		description: string | null;
		id: number;
		title: string;
		updatedAt: string;
	};
	export const Material = class {
		constructor(values: Material) {
			Object.assign(this, values);
		}
	} as unknown as new (values: Material) => Material;
	export type Measurement = {
		createdAt: string;
		description: string | null;
		id: number;
		title: string;
		updatedAt: string;
	};
	export const Measurement = class {
		constructor(values: Measurement) {
			Object.assign(this, values);
		}
	} as unknown as new (values: Measurement) => Measurement;
}

namespace Models {
	export type _Get = Prettify<{
		search?: Record<string, unknown>;
		params: { "*": _Prim };
		response: void;
	}>;
	export type HealthGet = Prettify<{
		search?: Record<string, unknown>;
		response: void;
	}>;
	export type AuthMeGet = Prettify<{
		search?: Record<string, unknown>;
		response: {
			createdAt: string;
			email: string;
			id: number;
			image: string | null;
			name: string;
			updatedAt: string;
			emailVerified?: boolean;
		};
	}>;
	export type AuthLoginPost = Prettify<
		{
			search?: Record<string, unknown>;
			response: {
				accessToken: string;
				profile: {
					createdAt: string;
					email: string;
					id: number;
					image: string | null;
					name: string;
					updatedAt: string;
					emailVerified?: boolean;
				};
				refreshToken: string;
			};
		} & (
			| {
					body: {
						email: string;
						password: string;
					};
					formData?: never;
			  }
			| {
					body?: never;
					formData: FormData;
			  }
		)
	>;
	export type AuthRegisterPost = Prettify<
		{
			search?: Record<string, unknown>;
			response: {
				email: string;
			};
		} & (
			| {
					body: {
						email: string;
						name: string;
						password: string;
					};
					formData?: never;
			  }
			| {
					body?: never;
					formData: FormData;
			  }
		)
	>;
	export type AuthLogoutPost = Prettify<
		{
			search?: Record<string, unknown>;
			response: void;
		} & (
			| {
					body: {
						refreshToken?: string;
					};
					formData?: never;
			  }
			| {
					body?: never;
					formData: FormData;
			  }
		)
	>;
	export type AuthRefreshPost = Prettify<
		{
			search?: Record<string, unknown>;
			response: {
				accessToken: string;
				refreshToken: string;
			};
		} & (
			| {
					body: {
						refreshToken?: string;
					};
					formData?: never;
			  }
			| {
					body?: never;
					formData: FormData;
			  }
		)
	>;
	export type AuthVerifyPost = Prettify<
		{
			search?: Record<string, unknown>;
			response: {
				accessToken: string;
				profile: {
					createdAt: string;
					email: string;
					id: number;
					image: string | null;
					name: string;
					updatedAt: string;
					emailVerified?: boolean;
				};
				refreshToken: string;
			};
		} & (
			| {
					body: {
						code: string;
						email: string;
					};
					formData?: never;
			  }
			| {
					body?: never;
					formData: FormData;
			  }
		)
	>;
	export type IngredientPost = Prettify<
		{
			search?: Record<string, unknown>;
			response: {
				createdAt: string;
				id: number;
				material: string;
				materialId: number;
				measurement: string;
				measurementId: number;
				quantity: number;
				recipeId: number | null;
				updatedAt: string;
			};
		} & (
			| {
					body: {
						materialId: number;
						measurementId: number;
						quantity: number;
						recipeId: number;
					};
					formData?: never;
			  }
			| {
					body?: never;
					formData: FormData;
			  }
		)
	>;
	export type IngredientIdPut = Prettify<
		{
			search?: Record<string, unknown>;
			params: {
				id: number;
			};
			response: {
				createdAt: string;
				id: number;
				material: string;
				materialId: number;
				measurement: string;
				measurementId: number;
				quantity: number;
				recipeId: number | null;
				updatedAt: string;
			};
		} & (
			| {
					body: {
						materialId?: number;
						measurementId?: number;
						quantity?: number;
						recipeId?: number;
					};
					formData?: never;
			  }
			| {
					body?: never;
					formData: FormData;
			  }
		)
	>;
	export type IngredientByRecipeIdGet = Prettify<{
		search?: Record<string, unknown>;
		params: {
			id: number;
		};
		response: {
			createdAt: string;
			id: number;
			material: string;
			materialId: number;
			measurement: string;
			measurementId: number;
			quantity: number;
			recipeId: number | null;
			updatedAt: string;
		}[];
	}>;
	export type MaterialPost = Prettify<
		{
			search?: Record<string, unknown>;
			response: {
				createdAt: string;
				description: string | null;
				id: number;
				title: string;
				updatedAt: string;
			};
		} & (
			| {
					body: {
						description: string | null;
						title: string;
					};
					formData?: never;
			  }
			| {
					body?: never;
					formData: FormData;
			  }
		)
	>;
	export type MaterialGet = Prettify<{
		search?: Record<string, unknown>;
		response: {
			createdAt: string;
			description: string | null;
			id: number;
			title: string;
			updatedAt: string;
		}[];
	}>;
	export type MeasurementPost = Prettify<
		{
			search?: Record<string, unknown>;
			response: {
				createdAt: string;
				description: string | null;
				id: number;
				title: string;
				updatedAt: string;
			};
		} & (
			| {
					body: {
						description: string | null;
						title: string;
					};
					formData?: never;
			  }
			| {
					body?: never;
					formData: FormData;
			  }
		)
	>;
	export type MeasurementGet = Prettify<{
		search?: Record<string, unknown>;
		response: {
			createdAt: string;
			description: string | null;
			id: number;
			title: string;
			updatedAt: string;
		}[];
	}>;
	export type RecipePost = Prettify<
		{
			search?: Record<string, unknown>;
			response: {
				createdAt: string;
				description: string;
				id: number;
				image: string | null;
				isPublic: boolean;
				profileId: number;
				title: string;
				updatedAt: string;
				likeCount?: number;
				isLiked?: boolean;
			};
		} & (
			| {
					body: {
						description: string;
						isPublic: boolean;
						title: string;
						image?: unknown;
					};
					formData?: never;
			  }
			| {
					body?: never;
					formData: FormData;
			  }
		)
	>;
	export type RecipeIdPut = Prettify<
		{
			search?: Record<string, unknown>;
			params: {
				id: number;
			};
			response: {
				createdAt: string;
				description: string;
				id: number;
				image: string | null;
				isPublic: boolean;
				profileId: number;
				title: string;
				updatedAt: string;
				likeCount?: number;
				isLiked?: boolean;
			};
		} & (
			| {
					body: {
						deletedIngredientIds?: number[];
						description?: string;
						image?: unknown;
						isPublic?: boolean;
						newIngredients?: {
							materialId: number;
							measurementId: number;
							quantity: number;
						}[];
						newSteps?: {
							body: string;
							order: number;
						}[];
						title?: string;
						updatedSteps?: {
							body: string;
							id: number;
							order: number;
						}[];
					};
					formData?: never;
			  }
			| {
					body?: never;
					formData: FormData;
			  }
		)
	>;
	export type RecipeGet = Prettify<{
		search: {
			limit?: number;
			materialIds?: number[];
			owner?: "all" | "me" | "others";
			page?: number;
			search?: string;
			sortBy?: "createdAt" | "likes" | "steps" | "title";
			sortOrder?: "asc" | "desc";
		};
		response: {
			currentLimit: number;
			currentPage: number;
			data: {
				createdAt: string;
				description: string;
				id: number;
				image: string | null;
				isPublic: boolean;
				profileId: number;
				title: string;
				updatedAt: string;
				likeCount?: number;
				isLiked?: boolean;
			}[];
			totalCount: number;
			totalPages: number;
		};
	}>;
	export type RecipePopularGet = Prettify<{
		search: {
			limit?: number;
			page?: number;
		};
		response: {
			createdAt: string;
			description: string;
			id: number;
			image: string | null;
			isPublic: boolean;
			profileId: number;
			title: string;
			updatedAt: string;
			likeCount?: number;
			isLiked?: boolean;
		}[];
	}>;
	export type RecipeLikePost = Prettify<
		{
			search?: Record<string, unknown>;
			response: {
				id: number;
			};
		} & (
			| {
					body: {
						id: number;
						isLiked: boolean;
					};
					formData?: never;
			  }
			| {
					body?: never;
					formData: FormData;
			  }
		)
	>;
	export type StepPost = Prettify<
		{
			search?: Record<string, unknown>;
			response: {
				body: string;
				createdAt: string;
				id: number;
				order: number;
				recipeId: number;
				updatedAt: string;
			};
		} & (
			| {
					body: {
						body: string;
						order: number;
						recipeId: number;
					};
					formData?: never;
			  }
			| {
					body?: never;
					formData: FormData;
			  }
		)
	>;
	export type StepIdPut = Prettify<
		{
			search?: Record<string, unknown>;
			params: {
				id: number;
			};
			response: {
				body: string;
				createdAt: string;
				id: number;
				order: number;
				recipeId: number;
				updatedAt: string;
			};
		} & (
			| {
					body: {
						body?: string;
						order?: number;
						recipeId?: number;
					};
					formData?: never;
			  }
			| {
					body?: never;
					formData: FormData;
			  }
		)
	>;
	export type StepByRecipeIdGet = Prettify<{
		search?: Record<string, unknown>;
		params: {
			id: number;
		};
		response: {
			body: string;
			createdAt: string;
			id: number;
			order: number;
			recipeId: number;
			updatedAt: string;
		}[];
	}>;
	export type CookbookIdGet = Prettify<{
		search?: Record<string, unknown>;
		params: {
			id: number;
		};
		response: {
			createdAt: string;
			description: string;
			id: number;
			image: string | null;
			ingredients: {
				createdAt: string;
				id: number;
				material: string;
				materialId: number;
				measurement: string;
				measurementId: number;
				quantity: number;
				recipeId: number | null;
				updatedAt: string;
			}[];
			isPublic: boolean;
			profileId: number;
			steps: {
				body: string;
				createdAt: string;
				id: number;
				order: number;
				recipeId: number;
				updatedAt: string;
			}[];
			title: string;
			updatedAt: string;
			likeCount?: number;
			isLiked?: boolean;
		};
	}>;
	export type CookbookPost = Prettify<
		{
			search?: Record<string, unknown>;
			response: {
				createdAt: string;
				description: string;
				id: number;
				image: string | null;
				ingredients: {
					createdAt: string;
					id: number;
					material: string;
					materialId: number;
					measurement: string;
					measurementId: number;
					quantity: number;
					recipeId: number | null;
					updatedAt: string;
				}[];
				isPublic: boolean;
				profileId: number;
				steps: {
					body: string;
					createdAt: string;
					id: number;
					order: number;
					recipeId: number;
					updatedAt: string;
				}[];
				title: string;
				updatedAt: string;
				likeCount?: number;
				isLiked?: boolean;
			};
		} & (
			| {
					body: {
						description: string;
						ingredients: {
							materialId: number;
							measurementId: number;
							quantity: number;
						}[];
						isPublic: boolean;
						steps: {
							body: string;
							order: number;
						}[];
						title: string;
						image?: unknown;
					};
					formData?: never;
			  }
			| {
					body?: never;
					formData: FormData;
			  }
		)
	>;
	export type CookbookIdPut = Prettify<
		{
			search?: Record<string, unknown>;
			params: {
				id: number;
			};
			response: {
				createdAt: string;
				description: string;
				id: number;
				image: string | null;
				ingredients: {
					createdAt: string;
					id: number;
					material: string;
					materialId: number;
					measurement: string;
					measurementId: number;
					quantity: number;
					recipeId: number | null;
					updatedAt: string;
				}[];
				isPublic: boolean;
				profileId: number;
				steps: {
					body: string;
					createdAt: string;
					id: number;
					order: number;
					recipeId: number;
					updatedAt: string;
				}[];
				title: string;
				updatedAt: string;
				likeCount?: number;
				isLiked?: boolean;
			};
		} & (
			| {
					body: {
						deletedIngredientIds?: number[];
						description?: string;
						image?: unknown;
						isPublic?: boolean;
						newIngredients?: {
							materialId: number;
							measurementId: number;
							quantity: number;
						}[];
						newSteps?: {
							body: string;
							order: number;
						}[];
						title?: string;
						updatedSteps?: {
							body: string;
							id: number;
							order: number;
						}[];
					};
					formData?: never;
			  }
			| {
					body?: never;
					formData: FormData;
			  }
		)
	>;
}

namespace Args {
	export type _Get = ExtractArgs<Models._Get>;
	export type HealthGet = ExtractArgs<Models.HealthGet>;
	export type AuthMeGet = ExtractArgs<Models.AuthMeGet>;
	export type AuthLoginPost = ExtractArgs<Models.AuthLoginPost>;
	export type AuthRegisterPost = ExtractArgs<Models.AuthRegisterPost>;
	export type AuthLogoutPost = ExtractArgs<Models.AuthLogoutPost>;
	export type AuthRefreshPost = ExtractArgs<Models.AuthRefreshPost>;
	export type AuthVerifyPost = ExtractArgs<Models.AuthVerifyPost>;
	export type IngredientPost = ExtractArgs<Models.IngredientPost>;
	export type IngredientIdPut = ExtractArgs<Models.IngredientIdPut>;
	export type IngredientByRecipeIdGet = ExtractArgs<Models.IngredientByRecipeIdGet>;
	export type MaterialPost = ExtractArgs<Models.MaterialPost>;
	export type MaterialGet = ExtractArgs<Models.MaterialGet>;
	export type MeasurementPost = ExtractArgs<Models.MeasurementPost>;
	export type MeasurementGet = ExtractArgs<Models.MeasurementGet>;
	export type RecipePost = ExtractArgs<Models.RecipePost>;
	export type RecipeIdPut = ExtractArgs<Models.RecipeIdPut>;
	export type RecipeGet = ExtractArgs<Models.RecipeGet>;
	export type RecipePopularGet = ExtractArgs<Models.RecipePopularGet>;
	export type RecipeLikePost = ExtractArgs<Models.RecipeLikePost>;
	export type StepPost = ExtractArgs<Models.StepPost>;
	export type StepIdPut = ExtractArgs<Models.StepIdPut>;
	export type StepByRecipeIdGet = ExtractArgs<Models.StepByRecipeIdGet>;
	export type CookbookIdGet = ExtractArgs<Models.CookbookIdGet>;
	export type CookbookPost = ExtractArgs<Models.CookbookPost>;
	export type CookbookIdPut = ExtractArgs<Models.CookbookIdPut>;
}

class CorpusApi {
	constructor(public readonly baseUrl: string) {}

	public fetchFn: <R = unknown>(args: RequestDescriptor) => Promise<R> = async (args) => {
		const url = new URL(args.endpoint, this.baseUrl);
		const headers = new Headers(args.headers);
		const method: RequestInit["method"] = args.method;
		let body: RequestInit["body"];
		if (args.search) {
			for (const [key, val] of Object.entries(args.search)) {
				if (val == null) {
					continue;
				}
				url.searchParams.append(
					key,
					typeof val === "object" ? JSON.stringify(val) : String(val as _Prim),
				);
			}
		}
		if (args.body) {
			if (!headers.has("Content-Type") || !headers.has("content-type")) {
				if (!(args.body instanceof FormData)) {
					headers.set("Content-Type", "application/json");
				}
			}
			body = args.body instanceof FormData ? args.body : JSON.stringify(args.body);
		}
		const req = new Request(url, { method, headers, body, ...args.init });
		const res = await fetch(req);
		const contentType = res.headers.get("content-type");
		if (contentType?.includes("application/json")) return await res.json();
		if (contentType?.includes("text/")) return await res.text();
		return await res.blob();
	};

	public setFetchFn(cb: <R = unknown>(args: RequestDescriptor) => Promise<R>) {
		return (this.fetchFn = cb);
	}

	public readonly endpoints = {
		_Get: (p: Args._Get["params"]) => `/${String(p["*"])}`,
		healthGet: "/api/health",
		authMeGet: "/api/auth/me",
		authLoginPost: "/api/auth/login",
		authRegisterPost: "/api/auth/register",
		authLogoutPost: "/api/auth/logout",
		authRefreshPost: "/api/auth/refresh",
		authVerifyPost: "/api/auth/verify",
		ingredientPost: "/api/ingredient",
		ingredientIdPut: (p: Args.IngredientIdPut["params"]) => `/api/ingredient/${String(p.id)}`,
		ingredientByRecipeIdGet: (p: Args.IngredientByRecipeIdGet["params"]) =>
			`/api/ingredient/by-recipe/${String(p.id)}`,
		materialPost: "/api/material",
		materialGet: "/api/material",
		measurementPost: "/api/measurement",
		measurementGet: "/api/measurement",
		recipePost: "/api/recipe",
		recipeIdPut: (p: Args.RecipeIdPut["params"]) => `/api/recipe/${String(p.id)}`,
		recipeGet: "/api/recipe",
		recipePopularGet: "/api/recipe/popular",
		recipeLikePost: "/api/recipe/like",
		stepPost: "/api/step",
		stepIdPut: (p: Args.StepIdPut["params"]) => `/api/step/${String(p.id)}`,
		stepByRecipeIdGet: (p: Args.StepByRecipeIdGet["params"]) =>
			`/api/step/by-recipe/${String(p.id)}`,
		cookbookIdGet: (p: Args.CookbookIdGet["params"]) => `/api/cookbook/${String(p.id)}`,
		cookbookPost: "/api/cookbook",
		cookbookIdPut: (p: Args.CookbookIdPut["params"]) => `/api/cookbook/${String(p.id)}`,
	};

	public _Get = (args: Args._Get) => {
		const req = {
			endpoint: `/${String(args.params["*"])}`,
			method: "GET",
			search: args.search,
		};
		return this.fetchFn<Models._Get["response"]>(req);
	};

	public healthGet = (args: Args.HealthGet) => {
		const req = {
			endpoint: "/api/health",
			method: "GET",
			search: args.search,
		};
		return this.fetchFn<Models.HealthGet["response"]>(req);
	};

	public authMeGet = (args: Args.AuthMeGet) => {
		const req = {
			endpoint: "/api/auth/me",
			method: "GET",
			search: args.search,
		};
		return this.fetchFn<Models.AuthMeGet["response"]>(req);
	};

	public authLoginPost = (args: Args.AuthLoginPost) => {
		const req = {
			endpoint: "/api/auth/login",
			method: "POST",
			search: args.search,
			body: args.body ?? args.formData,
		};
		return this.fetchFn<Models.AuthLoginPost["response"]>(req);
	};

	public authRegisterPost = (args: Args.AuthRegisterPost) => {
		const req = {
			endpoint: "/api/auth/register",
			method: "POST",
			search: args.search,
			body: args.body ?? args.formData,
		};
		return this.fetchFn<Models.AuthRegisterPost["response"]>(req);
	};

	public authLogoutPost = (args: Args.AuthLogoutPost) => {
		const req = {
			endpoint: "/api/auth/logout",
			method: "POST",
			search: args.search,
			body: args.body ?? args.formData,
		};
		return this.fetchFn<Models.AuthLogoutPost["response"]>(req);
	};

	public authRefreshPost = (args: Args.AuthRefreshPost) => {
		const req = {
			endpoint: "/api/auth/refresh",
			method: "POST",
			search: args.search,
			body: args.body ?? args.formData,
		};
		return this.fetchFn<Models.AuthRefreshPost["response"]>(req);
	};

	public authVerifyPost = (args: Args.AuthVerifyPost) => {
		const req = {
			endpoint: "/api/auth/verify",
			method: "POST",
			search: args.search,
			body: args.body ?? args.formData,
		};
		return this.fetchFn<Models.AuthVerifyPost["response"]>(req);
	};

	public ingredientPost = (args: Args.IngredientPost) => {
		const req = {
			endpoint: "/api/ingredient",
			method: "POST",
			search: args.search,
			body: args.body ?? args.formData,
		};
		return this.fetchFn<Models.IngredientPost["response"]>(req);
	};

	public ingredientIdPut = (args: Args.IngredientIdPut) => {
		const req = {
			endpoint: `/api/ingredient/${String(args.params.id)}`,
			method: "PUT",
			search: args.search,
			body: args.body ?? args.formData,
		};
		return this.fetchFn<Models.IngredientIdPut["response"]>(req);
	};

	public ingredientByRecipeIdGet = (args: Args.IngredientByRecipeIdGet) => {
		const req = {
			endpoint: `/api/ingredient/by-recipe/${String(args.params.id)}`,
			method: "GET",
			search: args.search,
		};
		return this.fetchFn<Models.IngredientByRecipeIdGet["response"]>(req);
	};

	public materialPost = (args: Args.MaterialPost) => {
		const req = {
			endpoint: "/api/material",
			method: "POST",
			search: args.search,
			body: args.body ?? args.formData,
		};
		return this.fetchFn<Models.MaterialPost["response"]>(req);
	};

	public materialGet = (args: Args.MaterialGet) => {
		const req = {
			endpoint: "/api/material",
			method: "GET",
			search: args.search,
		};
		return this.fetchFn<Models.MaterialGet["response"]>(req);
	};

	public measurementPost = (args: Args.MeasurementPost) => {
		const req = {
			endpoint: "/api/measurement",
			method: "POST",
			search: args.search,
			body: args.body ?? args.formData,
		};
		return this.fetchFn<Models.MeasurementPost["response"]>(req);
	};

	public measurementGet = (args: Args.MeasurementGet) => {
		const req = {
			endpoint: "/api/measurement",
			method: "GET",
			search: args.search,
		};
		return this.fetchFn<Models.MeasurementGet["response"]>(req);
	};

	public recipePost = (args: Args.RecipePost) => {
		const req = {
			endpoint: "/api/recipe",
			method: "POST",
			search: args.search,
			body: args.body ?? args.formData,
		};
		return this.fetchFn<Models.RecipePost["response"]>(req);
	};

	public recipeIdPut = (args: Args.RecipeIdPut) => {
		const req = {
			endpoint: `/api/recipe/${String(args.params.id)}`,
			method: "PUT",
			search: args.search,
			body: args.body ?? args.formData,
		};
		return this.fetchFn<Models.RecipeIdPut["response"]>(req);
	};

	public recipeGet = (args: Args.RecipeGet) => {
		const req = {
			endpoint: "/api/recipe",
			method: "GET",
			search: args.search,
		};
		return this.fetchFn<Models.RecipeGet["response"]>(req);
	};

	public recipePopularGet = (args: Args.RecipePopularGet) => {
		const req = {
			endpoint: "/api/recipe/popular",
			method: "GET",
			search: args.search,
		};
		return this.fetchFn<Models.RecipePopularGet["response"]>(req);
	};

	public recipeLikePost = (args: Args.RecipeLikePost) => {
		const req = {
			endpoint: "/api/recipe/like",
			method: "POST",
			search: args.search,
			body: args.body ?? args.formData,
		};
		return this.fetchFn<Models.RecipeLikePost["response"]>(req);
	};

	public stepPost = (args: Args.StepPost) => {
		const req = {
			endpoint: "/api/step",
			method: "POST",
			search: args.search,
			body: args.body ?? args.formData,
		};
		return this.fetchFn<Models.StepPost["response"]>(req);
	};

	public stepIdPut = (args: Args.StepIdPut) => {
		const req = {
			endpoint: `/api/step/${String(args.params.id)}`,
			method: "PUT",
			search: args.search,
			body: args.body ?? args.formData,
		};
		return this.fetchFn<Models.StepIdPut["response"]>(req);
	};

	public stepByRecipeIdGet = (args: Args.StepByRecipeIdGet) => {
		const req = {
			endpoint: `/api/step/by-recipe/${String(args.params.id)}`,
			method: "GET",
			search: args.search,
		};
		return this.fetchFn<Models.StepByRecipeIdGet["response"]>(req);
	};

	public cookbookIdGet = (args: Args.CookbookIdGet) => {
		const req = {
			endpoint: `/api/cookbook/${String(args.params.id)}`,
			method: "GET",
			search: args.search,
		};
		return this.fetchFn<Models.CookbookIdGet["response"]>(req);
	};

	public cookbookPost = (args: Args.CookbookPost) => {
		const req = {
			endpoint: "/api/cookbook",
			method: "POST",
			search: args.search,
			body: args.body ?? args.formData,
		};
		return this.fetchFn<Models.CookbookPost["response"]>(req);
	};

	public cookbookIdPut = (args: Args.CookbookIdPut) => {
		const req = {
			endpoint: `/api/cookbook/${String(args.params.id)}`,
			method: "PUT",
			search: args.search,
			body: args.body ?? args.formData,
		};
		return this.fetchFn<Models.CookbookIdPut["response"]>(req);
	};
}

export type { RequestDescriptor, Models, Args };

export { Entities, CorpusApi };
