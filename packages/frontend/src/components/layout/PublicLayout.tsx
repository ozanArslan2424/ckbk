import { Outlet } from "react-router";

import { AppFooter } from "@/components/layout/AppFooter";
import { AppHeader } from "@/components/layout/AppHeader";

export function PublicLayout() {
	return (
		<div className="relative flex min-h-screen w-full flex-col">
			<AppHeader />

			<main className="flex flex-1 flex-col">
				<Outlet />
			</main>

			<AppFooter />
		</div>
	);
}
