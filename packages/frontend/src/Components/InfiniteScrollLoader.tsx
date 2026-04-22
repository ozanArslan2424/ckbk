import { LoaderIcon } from "lucide-react";
import type { ReactNode } from "react";

import type { useInfiniteScrollQuery } from "@/hooks/useInfiniteScroll";

type InfiniteScrollLoaderProps = Pick<
	ReturnType<typeof useInfiniteScrollQuery>,
	"isFetchingNextPage" | "scrollRef"
> & {
	customIcon?: ReactNode;
};

export function InfiniteScrollLoader(props: InfiniteScrollLoaderProps) {
	const renderIcon = props.customIcon ? (
		props.customIcon
	) : (
		<LoaderIcon className="animate-spin" size={24} />
	);

	return (
		<div ref={props.scrollRef} className="flex w-full items-center justify-center py-8">
			{props.isFetchingNextPage && renderIcon}
		</div>
	);
}
