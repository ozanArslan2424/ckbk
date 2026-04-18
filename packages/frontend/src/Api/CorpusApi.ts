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
  };
  export type Ingredient = {
    createdAt: string;
    id: number;
    materialId: number;
    measurementId: number;
    quantity: number;
    recipeId: number | null;
    updatedAt: string;
  };
  export type Material = {
    createdAt: string;
    description: string | null;
    id: number;
    title: string;
    updatedAt: string;
  };
  export type Measurement = {
    createdAt: string;
    description: string | null;
    id: number;
    title: string;
    updatedAt: string;
  };
  export type Recipe = {
    createdAt: string;
    description: string;
    id: number;
    image: string | null;
    isLiked: boolean;
    isPublic: boolean;
    likeCount: number;
    profileId: number;
    title: string;
    updatedAt: string;
  };
  export type Step = {
    body: string;
    createdAt: string;
    id: number;
    order: number;
    recipeId: number;
    updatedAt: string;
  };
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
      emailVerified: boolean;
      id: number;
      image: string | null;
      name: string;
      updatedAt: string;
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
        materialId: number;
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
  export type IngredientByRecipeRecipeIdGet = Prettify<{
    search?: Record<string, unknown>;
    params: {
      recipeId: string;
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
        isLiked: boolean;
        isPublic: boolean;
        likeCount: number;
        profileId: number;
        title: string;
        updatedAt: string;
      };
    } & (
      | {
          body: {
            description: string;
            isPublic: string;
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
  export type RecipeGet = Prettify<{
    search: {
      limit?: string;
      materialIds?: string[];
      mine?: string;
      page?: string;
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
        isLiked: boolean;
        isPublic: boolean;
        likeCount: number;
        profileId: number;
        title: string;
        updatedAt: string;
      }[];
      totalCount: number;
      totalPages: number;
    };
  }>;
  export type RecipePopularGet = Prettify<{
    search: {
      limit?: string;
      page?: string;
    };
    response: {
      createdAt: string;
      description: string;
      id: number;
      image: string | null;
      isLiked: boolean;
      isPublic: boolean;
      likeCount: number;
      profileId: number;
      title: string;
      updatedAt: string;
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
  export type StepByRecipeRecipeIdGet = Prettify<{
    search?: Record<string, unknown>;
    params: {
      recipeId: string;
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
  export type IngredientByRecipeRecipeIdGet =
    ExtractArgs<Models.IngredientByRecipeRecipeIdGet>;
  export type MaterialPost = ExtractArgs<Models.MaterialPost>;
  export type MaterialGet = ExtractArgs<Models.MaterialGet>;
  export type MeasurementPost = ExtractArgs<Models.MeasurementPost>;
  export type MeasurementGet = ExtractArgs<Models.MeasurementGet>;
  export type RecipePost = ExtractArgs<Models.RecipePost>;
  export type RecipeGet = ExtractArgs<Models.RecipeGet>;
  export type RecipePopularGet = ExtractArgs<Models.RecipePopularGet>;
  export type RecipeLikePost = ExtractArgs<Models.RecipeLikePost>;
  export type StepPost = ExtractArgs<Models.StepPost>;
  export type StepByRecipeRecipeIdGet =
    ExtractArgs<Models.StepByRecipeRecipeIdGet>;
}

class CorpusApi {
  constructor(public readonly baseUrl: string) {}

  public fetchFn: <R = unknown>(args: RequestDescriptor) => Promise<R> = async (
    args,
  ) => {
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
          typeof val === "object"
            ? JSON.stringify(val as object)
            : String(val as _Prim),
        );
      }
    }
    if (args.body) {
      if (!headers.has("Content-Type") || !headers.has("content-type")) {
        if (!(args.body instanceof FormData)) {
          headers.set("Content-Type", "application/json");
        }
      }
      body =
        args.body instanceof FormData ? args.body : JSON.stringify(args.body);
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
    ingredientByRecipeRecipeIdGet: (
      p: Args.IngredientByRecipeRecipeIdGet["params"],
    ) => `/api/ingredient/by-recipe/${String(p.recipeId)}`,
    materialPost: "/api/material",
    materialGet: "/api/material",
    measurementPost: "/api/measurement",
    measurementGet: "/api/measurement",
    recipePost: "/api/recipe",
    recipeGet: "/api/recipe",
    recipePopularGet: "/api/recipe/popular",
    recipeLikePost: "/api/recipe/like",
    stepPost: "/api/step",
    stepByRecipeRecipeIdGet: (p: Args.StepByRecipeRecipeIdGet["params"]) =>
      `/api/step/by-recipe/${String(p.recipeId)}`,
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

  public ingredientByRecipeRecipeIdGet = (
    args: Args.IngredientByRecipeRecipeIdGet,
  ) => {
    const req = {
      endpoint: `/api/ingredient/by-recipe/${String(args.params.recipeId)}`,
      method: "GET",
      search: args.search,
    };
    return this.fetchFn<Models.IngredientByRecipeRecipeIdGet["response"]>(req);
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

  public stepByRecipeRecipeIdGet = (args: Args.StepByRecipeRecipeIdGet) => {
    const req = {
      endpoint: `/api/step/by-recipe/${String(args.params.recipeId)}`,
      method: "GET",
      search: args.search,
    };
    return this.fetchFn<Models.StepByRecipeRecipeIdGet["response"]>(req);
  };
}

export type { RequestDescriptor, Entities, Models, Args };

export { CorpusApi };
