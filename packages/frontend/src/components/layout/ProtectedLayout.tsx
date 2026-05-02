import { Outlet, useNavigate } from "react-router";

import { useAuthGuard } from "@/app/Auth/useAuthGuard";
import { PendingCard } from "@/components/cards/PendingCard";
import { AppFooter } from "@/components/layout/AppFooter";
import { AppHeader } from "@/components/layout/AppHeader";
import { routes } from "@/router";

export function ProtectedLayout() {
	const nav = useNavigate();
	const { isPending } = useAuthGuard({
		onError() {
			void nav(routes.login);
		},
	});

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
