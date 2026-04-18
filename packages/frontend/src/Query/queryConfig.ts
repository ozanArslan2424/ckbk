import type { QueryClientConfig } from "@tanstack/react-query";
import { toast } from "sonner";

import { getErrorMessage, isObjectWith } from "@/lib/utils";

function handleRetry(failCount: number, error: unknown) {
	const RETRY_LIMIT = 3;

	if (isObjectWith<{ status: number }>(error, "status") && typeof error.status === "number") {
		const isTimeout = [408, 504].includes(error.status);

		if (isTimeout) {
			return failCount < RETRY_LIMIT;
		} else if (error.status > 400) {
			return false;
		} else {
			return false;
		}
	}

	return false;
}

function handleMutationSettle(res: unknown, err: Error | null) {
	if (isObjectWith<{ message: string }>(res, "message")) {
		toast.success(res.message);
	} else if (err) {
		if (import.meta.env.NODE_ENV !== "production") {
			console.log(err);
		}
		toast.error(getErrorMessage(err));
	}
}

export const queryConfig: QueryClientConfig = {
	defaultOptions: {
		queries: {
			retry: handleRetry,
			staleTime: Infinity,
			refetchOnWindowFocus: false,
		},
		mutations: {
			retry: handleRetry,
			onSettled: handleMutationSettle,
		},
	},
};
