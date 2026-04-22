import axiosDefault from "axios";
import type {
	AxiosInstance,
	AxiosResponse,
	InternalAxiosRequestConfig,
	AxiosRequestConfig,
} from "axios";
import qs from "qs";

import type { RequestDescriptor } from "@/lib/CorpusApi";

interface RequestInterface {
	get: <D>(url: string, config?: AxiosRequestConfig) => Promise<D>;
	delete: <D>(url: string, config?: AxiosRequestConfig) => Promise<D>;
	head: <D>(url: string, config?: AxiosRequestConfig) => Promise<D>;
	options: <D>(url: string, config?: AxiosRequestConfig) => Promise<D>;
	post: <D, B>(url: string, body?: B, config?: AxiosRequestConfig) => Promise<D>;
	put: <D, B>(url: string, body?: B, config?: AxiosRequestConfig) => Promise<D>;
	patch: <D, B>(url: string, body?: B, config?: AxiosRequestConfig) => Promise<D>;
	send: <D, B>(args: {
		url: string;
		method: string;
		body?: B;
		config?: AxiosRequestConfig;
	}) => Promise<D>;
}

type RequestConfig = {
	baseURL: string;
	withCredentials?: boolean;
	refreshIgnoredEndpoints: string[];
	onRefreshToken: (axiosInstance: AxiosInstance) => Promise<string>;
	onBeforeRequest?: (config: InternalAxiosRequestConfig) => void | Promise<void>;
	getAccessToken: () => string | null;
	setAccessToken: (value: string | null) => void;
};

export class RequestClient implements RequestInterface {
	private readonly instance: AxiosInstance;
	private isRefreshing = false;
	private failedQueue: ((token: string) => void)[] = [];

	private readonly baseURL: RequestConfig["baseURL"];
	private readonly withCredentials?: RequestConfig["withCredentials"];
	private readonly refreshIgnoredEndpoints: RequestConfig["refreshIgnoredEndpoints"];
	private readonly onRefreshToken: RequestConfig["onRefreshToken"];
	private readonly onBeforeRequest?: RequestConfig["onBeforeRequest"];
	private readonly getAccessToken: RequestConfig["getAccessToken"];
	private readonly setAccessToken: RequestConfig["setAccessToken"];

	constructor(readonly config: RequestConfig) {
		this.baseURL = config.baseURL;
		this.withCredentials = config.withCredentials;
		this.refreshIgnoredEndpoints = config.refreshIgnoredEndpoints;
		this.onRefreshToken = config.onRefreshToken;
		this.onBeforeRequest = config.onBeforeRequest;
		this.getAccessToken = config.getAccessToken;
		this.setAccessToken = config.setAccessToken;

		this.instance = this.createInstance();
		this.attachRequestInterceptor();
		this.attachResponseInterceptor();
	}

	private createInstance() {
		return axiosDefault.create({
			baseURL: this.baseURL,
			timeout: 10000,
			withCredentials: this.withCredentials,
			paramsSerializer: (params) =>
				qs.stringify(params, {
					filter: (_, value) => value ?? undefined,
					skipNulls: true,
					arrayFormat: "indices",
					serializeDate: (date) => date.toISOString(),
				}),
		});
	}

	private bearer(token: string) {
		return `Bearer ${token}`;
	}

	private attachRequestInterceptor() {
		this.instance.interceptors.request.use(
			async (config: InternalAxiosRequestConfig) => {
				const token = this.getAccessToken();
				if (token) {
					config.headers.Authorization = this.bearer(token);
				}

				await this.onBeforeRequest?.(config);

				return config;
			},
			async (err) => Promise.reject(err),
		);
	}

	private processQueue(token: string) {
		for (const callback of this.failedQueue) {
			callback(token);
		}
		this.failedQueue = [];
	}

	private attachResponseInterceptor() {
		this.instance.interceptors.response.use(
			(res: AxiosResponse) => res,
			async (err) => {
				const config = err.config;

				const isNotRefreshed = this.refreshIgnoredEndpoints.some((v) => {
					return config.url?.includes(v);
				});
				const isDifferentError = err.response?.status !== 401;
				const isRetryError = config._retry;

				if (isNotRefreshed || isDifferentError || isRetryError) {
					return Promise.reject(err);
				}

				config._retry = true;

				if (this.isRefreshing) {
					return new Promise((resolve) => {
						this.failedQueue.push((newToken: string) => {
							config.headers.Authorization = this.bearer(newToken);
							config._retry = false;
							resolve(this.instance(config));
						});
					});
				}

				try {
					this.isRefreshing = true;
					this.setAccessToken(null);
					const newToken = await this.onRefreshToken(this.instance);
					this.setAccessToken(newToken);
					this.instance.defaults.headers.common.Authorization = this.bearer(newToken);
					config.headers.Authorization = this.bearer(newToken);
					this.processQueue(newToken);
					return await this.instance(config);
				} catch (refreshErr) {
					this.failedQueue = [];
					return await Promise.reject(refreshErr);
				} finally {
					this.isRefreshing = false;
				}
			},
		);
	}

	private async resolve<T>(promise: Promise<AxiosResponse<T>>) {
		const res = await promise;
		return res.data;
	}

	get: RequestInterface["get"] = async (url, config) =>
		this.resolve(this.instance.get(url, config));

	delete: RequestInterface["delete"] = async (url, config) =>
		this.resolve(this.instance.delete(url, config));

	head: RequestInterface["head"] = async (url, config) =>
		this.resolve(this.instance.head(url, config));

	options: RequestInterface["options"] = async (url, config) =>
		this.resolve(this.instance.options(url, config));

	post: RequestInterface["post"] = async (url, body, config) =>
		this.resolve(this.instance.post(url, body, config));

	put: RequestInterface["put"] = async (url, body, config) =>
		this.resolve(this.instance.put(url, body, config));

	patch: RequestInterface["patch"] = async (url, body, config) =>
		this.resolve(this.instance.patch(url, body, config));

	send: RequestInterface["send"] = async (args) => {
		switch (args.method) {
			case "GET":
				return this.get(args.url, args.config);
			case "POST":
				return this.post(args.url, args.body, args.config);
			case "PUT":
				return this.put(args.url, args.body, args.config);
			case "PATCH":
				return this.patch(args.url, args.body, args.config);
			case "DELETE":
				return this.delete(args.url, args.config);
			case "HEAD":
				return this.head(args.url, args.config);
			default:
				return this.get(args.url, args.config);
		}
	};

	async corpus<R>(args: RequestDescriptor): Promise<R> {
		return this.send({
			url: args.endpoint,
			body: args.body,
			method: args.method,
			config: {
				params: args.search,
				...(args.init as AxiosRequestConfig),
			},
		});
	}
}
