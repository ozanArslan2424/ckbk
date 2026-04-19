import { Outlet } from "react-router";

import { AppHeader } from "@/Components/layout/AppHeader";
import { CONFIG } from "@/lib/CONFIG";
import { useLocale } from "@/Locale/useLocale";

export function PublicLayout() {
	const { txt } = useLocale("landing", {
		footer: ["footer"],
	});

	return (
		<div className="relative flex h-screen w-full flex-col">
			<AppHeader />

			<div className="flex flex-1 flex-col">
				<div className="flex flex-1 flex-col gap-2">
					<Outlet />
				</div>
			</div>

			<footer className="text-foreground/70 container mx-auto flex items-center justify-between px-4 py-8 text-center">
				<p className="text-sm sm:text-base">
					{txt.footer}{" "}
					<a className="hover:underline" href={CONFIG.copyLink}>
						{CONFIG.copyName}
					</a>
					.
				</p>
				<div />
			</footer>
		</div>
	);
}
