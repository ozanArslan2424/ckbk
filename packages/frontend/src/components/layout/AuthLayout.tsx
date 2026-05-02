import { Outlet, useNavigate } from "react-router";

import { useAuthGuard } from "@/app/Auth/useAuthGuard";
import { PendingCard } from "@/components/cards/PendingCard";
import { AppHeader } from "@/components/layout/AppHeader";
import { CONFIG } from "@/lib/CONFIG";
import { useLocale } from "@/locale/useLocale";
import { routes } from "@/router";

export function AuthLayout() {
	const { txt: txtLanding } = useLocale("landing", {
		subtitle: ["subtitle"],
	});
	const { txt } = useLocale("auth", {
		tosLabel: ["tos.label"],
	});

	const nav = useNavigate();
	const { isPending } = useAuthGuard({
		onSuccess() {
			void nav(routes.dashboard);
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
		<>
			<AppHeader />

			<div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center p-6 md:p-10">
				<div className="flex w-full max-w-sm flex-col gap-6 pt-20">
					<div className="flex flex-col gap-1">
						<h1 className="text-4xl font-black">🍳 {CONFIG.appTitle.toLocaleUpperCase()}</h1>
						<p className="text-muted-foreground">{txtLanding.subtitle}</p>
					</div>

					<Outlet />

					<p className="text-muted-foreground hover:text-foreground/70 cursor-pointer text-center text-xs transition-colors">
						{txt.tosLabel}
					</p>
				</div>
			</div>
		</>
	);
}
