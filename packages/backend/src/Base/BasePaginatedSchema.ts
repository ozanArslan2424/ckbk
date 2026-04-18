import { type } from "arktype";

export const BasePaginatedSchema = type({
	currentPage: "number",
	currentLimit: "number",
	totalPages: "number",
	totalCount: "number",
});
