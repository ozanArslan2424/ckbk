import { Method, type ApiRouteArgs, type ApiRouteDef, type ApiRouteFunc } from "@/Api/ApiTypes";
import type { RequestClient } from "@/Api/RequestClient";
import { Help } from "@/lib/Help";
import type { Schema } from "@/lib/Schema";
import { TXT } from "@/lib/TXT";

export abstract class ApiAbstract {
	abstract prefix?: string;

	constructor(private readonly request: RequestClient) {}

	protected route<
		B = unknown,
		S extends Help.UnknownObject = Help.UnknownObject,
		P extends Help.UnknownObject = Help.UnknownObject,
		R = unknown,
		E extends string = string,
		M extends Schema.RouteModel = Schema.RouteModel<B, S, P, R>,
	>(def: ApiRouteDef<E>, _model?: M): ApiRouteFunc<M> {
		const method = typeof def === "string" ? Method.GET : def.method;
		const path = Help.joinPathSegments(this.prefix, typeof def === "string" ? def : def.path);

		const fn = (args: ApiRouteArgs<M>) => {
			const { body, search: params, params: urlParams } = args;
			const resolvedPath = urlParams ? TXT.param(path, urlParams) : path;
			return this.request.send({
				url: resolvedPath,
				method,
				body,
				config: { params },
			});
		};

		fn.endpoint = path;
		fn.method = method;

		return fn as ApiRouteFunc<M>;
	}
}
