import { Outlet } from "react-router";

import { CONFIG } from "@/lib/CONFIG";

export function AppLayout() {
	return (
		<div className="bg-background min-h-screen">
			<title>{CONFIG.appTitle}</title>
			<Outlet />
		</div>
	);
}
