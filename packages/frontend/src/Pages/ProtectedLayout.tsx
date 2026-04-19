import { Outlet } from "react-router";

import { AppFooter } from "@/Components/layout/AppFooter";
import { AppHeader } from "@/Components/layout/AppHeader";
import { PendingCard } from "@/Components/PendingCard";
import { useAuthGuard } from "@/Hooks/useAuthGuard";

export function ProtectedLayout() {
	const { isPending } = useAuthGuard();

	if (isPending) {
		return <PendingCard />;
	}

	return (
		<div className="relative">
			<AppHeader />

			<div className="flex flex-1 flex-col">
				<div className="flex flex-1 flex-col gap-2">
					<Outlet />
				</div>
			</div>

			<AppFooter />
		</div>
	);
}
