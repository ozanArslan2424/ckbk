import { Outlet } from "react-router";

import { AppFooter } from "@/components/layout/AppFooter";
import { AppHeader } from "@/components/layout/AppHeader";
import { PendingCard } from "@/components/PendingCard";
import { useAuthGuard } from "@/hooks/useAuthGuard";

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
