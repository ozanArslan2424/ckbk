import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

import { useAppContext } from "@/app/AppContext";
import { AppHeader } from "@/components/layout/AppHeader";
import { useLocale } from "@/hooks/useLocale";
import { CONFIG } from "@/lib/CONFIG";
import { routes } from "@/router";

export function AuthLayout() {
	const { txt } = useLocale("auth", {
		tosLabel: ["tos.label"],
	});
	const nav = useNavigate();
	const { queryClient, authClient, store } = useAppContext();

	useEffect(() => {
		async function init() {
			try {
				const res = await queryClient.fetchQuery(authClient.queryMe({}));
				store.set("auth", res);
				await nav(routes.dashboard);
			} catch {}
		}

		void init();
	}, [queryClient, authClient, store, nav]);

	return (
		<>
			<AppHeader />

			<div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center p-6 md:p-10">
				<div className="flex w-full max-w-sm flex-col gap-6 pt-20">
					<h1 className="text-primary pb-6 text-center text-6xl leading-none font-black">
						{CONFIG.appTitle}
					</h1>

					<Outlet />

					<p className="text-muted-foreground hover:text-foreground/70 cursor-pointer text-center text-xs transition-colors">
						{txt.tosLabel}
					</p>
				</div>
			</div>
		</>
	);
}
