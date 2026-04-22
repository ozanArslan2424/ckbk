export function RecipeCardSkeleton() {
	return (
		<div className="relative">
			{/* Top Bar Skeletons (Badges/Buttons) */}
			<div className="absolute top-2 right-2 z-20 flex items-center gap-2">
				{/* Like Button Skeleton */}
				<div className="bg-muted h-8 w-12 animate-pulse rounded-md" />
			</div>

			<div className="card pointer-events-none">
				{/* Image Area Skeleton */}
				<div className="bg-muted relative h-48 animate-pulse overflow-hidden">
					<div className="flex h-full w-full items-center justify-center">
						<div className="bg-muted-foreground/10 h-12 w-12 rounded-full" />
					</div>
				</div>

				<article>
					{/* Title Skeleton */}
					<div className="bg-muted mb-2 h-6 w-3/4 animate-pulse rounded" />

					{/* Description Skeleton (Matches min-h-10 and line-clamp-2) */}
					<div className="space-y-2 py-1">
						<div className="bg-muted h-3 w-full animate-pulse rounded" />
						<div className="bg-muted h-3 w-5/6 animate-pulse rounded" />
					</div>
				</article>

				<footer className="flex items-center justify-between">
					{/* Footer/Timestamp Skeleton */}
					<div className="bg-muted h-3 w-24 animate-pulse rounded" />
				</footer>
			</div>
		</div>
	);
}
