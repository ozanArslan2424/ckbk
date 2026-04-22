import { Outlet } from "react-router";

import { CONFIG } from "@/lib/CONFIG";

export function AppLayout() {
	return (
		<div className="bg-background min-h-screen scroll-smooth">
			<title>{CONFIG.appTitle}</title>
			<Outlet />
		</div>
	);
}
