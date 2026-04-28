import type { UseInfiniteQueryResult } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useInView } from "react-intersection-observer";

import { useCommonLocale } from "@/hooks/useCommonLocale";
import { cn } from "@/lib/utils";

type ScrollLoaderCardProps<T> = {
	query: UseInfiniteQueryResult<T>;
	customIcon?: ReactNode;
	className?: string;
	rootMargin?: string;
};

export function ScrollLoaderCard<T>(props: ScrollLoaderCardProps<T>) {
	const { txt } = useCommonLocale();
	const scroller = useInView({
		threshold: 0,
		rootMargin: props.rootMargin ?? "100px",
		onChange: (inView) => (inView ? props.query.fetchNextPage() : undefined),
	});

	return (
		<div className={cn("w-full", props.className)} ref={scroller.ref}>
			{props.query.isFetchingNextPage ? (
				<div className="flex w-full items-center justify-center py-10">
					{props.customIcon ?? <LoaderIcon className="text-muted-foreground size-5 animate-spin" />}
				</div>
			) : props.query.hasNextPage ? (
				<div className="flex w-full items-center justify-center py-6">
					<button
						type="button"
						onClick={async () => props.query.fetchNextPage()}
						className="ghost sm"
					>
						{txt.more}
					</button>
				</div>
			) : (
				<div className="flex w-full items-center justify-center gap-3 py-10">
					<span className="bg-border h-px w-12" />
					<span className="text-muted-foreground text-xs">{txt.noMore}</span>
					<span className="bg-border h-px w-12" />
				</div>
			)}
		</div>
	);
}
