import type {
	DefaultError,
	InfiniteData,
	QueryKey,
	UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

export function useInfiniteScrollQuery<
	TQueryFnData,
	TError = DefaultError,
	TData = InfiniteData<TQueryFnData>,
	TQueryKey extends QueryKey = QueryKey,
	TPageParam = unknown,
>(
	args: UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam> & {
		rootMargin?: number;
	},
) {
	const { rootMargin, ...queryArgs } = args;
	const infiniteListQuery = useInfiniteQuery(queryArgs);
	const scroller = useInView({
		threshold: 0,
		rootMargin: `${rootMargin ?? 100}px`,
		onChange: (inView) => (inView ? () => infiniteListQuery.fetchNextPage() : undefined),
	});

	return { scrollRef: scroller.ref, ...infiniteListQuery };
}
