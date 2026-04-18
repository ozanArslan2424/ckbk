import type { Help } from "@/lib/Help";
import type { Schema } from "@/lib/Schema";

export const Method = {
	GET: "GET",
	POST: "POST",
	PUT: "PUT",
	PATCH: "PATCH",
	DELETE: "DELETE",
	HEAD: "HEAD",
	OPTIONS: "OPTIONS",
	CONNECT: "CONNECT",
	TRACE: "TRACE",
} as const;

export type Method = Help.ValueOf<typeof Method>;

export type ApiRouteDef<E extends string = string> = E | { method: Method; path: E };

export type ApiRouteArgs<M extends Schema.RouteModel> = Omit<
	Schema.InferModel<M>,
	"response" | "body"
> &
	("body" extends keyof Schema.InferModel<M>
		? { body: Schema.InferModel<M>["body"] | FormData }
		: { body?: undefined });

export type ApiRouteReturn<M extends Schema.RouteModel> = Required<
	Pick<Schema.InferModel<M>, "response">
>["response"];

export type ApiRouteFunc<M extends Schema.RouteModel> = ((
	args: ApiRouteArgs<M>,
) => Promise<ApiRouteReturn<M>>) & {
	endpoint: string;
	method: Method;
};
