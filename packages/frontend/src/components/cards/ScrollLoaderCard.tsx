import { LoaderIcon } from "lucide-react";
import type { ReactNode } from "react";

import { useCommonLocale } from "@/hooks/useCommonLocale";
import type { useInfiniteScrollQuery } from "@/hooks/useInfiniteScroll";

type ScrollLoaderCardProps = {
	query: ReturnType<typeof useInfiniteScrollQuery>;
	customIcon?: ReactNode;
};

export function ScrollLoaderCard(props: ScrollLoaderCardProps) {
	const { txt } = useCommonLocale();

	return (
		<div className="w-full" ref={props.query.scrollRef}>
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
