import { Outlet } from "react-router";

import { PendingCard } from "@/components/cards/PendingCard";
import { AppFooter } from "@/components/layout/AppFooter";
import { AppHeader } from "@/components/layout/AppHeader";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export function ProtectedLayout() {
	const { isPending } = useAuthGuard();

	if (isPending) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<PendingCard />
			</div>
		);
	}

	return (
		<div className="relative flex min-h-screen flex-col">
			<AppHeader />

			<main className="flex flex-1 flex-col pb-14">
				<Outlet />
			</main>

			<AppFooter />
		</div>
	);
}
