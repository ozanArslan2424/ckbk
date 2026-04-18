import type { BasePaginatedSchema } from "@/Base/BasePaginatedSchema";

type Interface = typeof BasePaginatedSchema.inferOut;

export class PaginatedData<T extends any[]> implements Interface {
	constructor(page: number, limit: number, count: number, data: T) {
		this.currentPage = page;
		this.currentLimit = limit;
		this.totalCount = count;
		this.totalPages = Math.ceil(count / limit);
		this.data = data;
	}

	public readonly currentPage: number;
	public readonly currentLimit: number;
	public readonly totalCount: number;
	public readonly data: T;
	public readonly totalPages: number;
}
