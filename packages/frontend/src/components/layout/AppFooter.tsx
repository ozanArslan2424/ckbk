import { CONFIG } from "@/lib/CONFIG";
import { useCommonLocale } from "@/locale/useCommonLocale";

export function AppFooter() {
	const { txt } = useCommonLocale();

	return (
		<footer className="border-border/40 bg-background/80 fixed bottom-0 left-0 z-40 flex h-10 w-full max-w-[100vw] shrink-0 items-center justify-between border-t px-4 backdrop-blur-md lg:px-8">
			<div className="container mx-auto flex items-center justify-between px-4 py-5 lg:px-8">
				<div className="flex items-center gap-2">
					<span className="bg-accent/70 size-1.5 rounded-full" />
					<p className="text-muted-foreground text-xs">
						{txt.footer}{" "}
						<a
							className="text-foreground/70 hover:text-foreground font-medium underline-offset-4 transition-colors hover:underline"
							href={CONFIG.copyLink}
						>
							{CONFIG.copyName}
						</a>
					</p>
				</div>

				<div />
			</div>
		</footer>
	);
}
