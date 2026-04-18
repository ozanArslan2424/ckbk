import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

import { AppHeader } from "@/Components/layout/AppHeader";
import { useAppContext } from "@/Context/AppContext";
import { CONFIG } from "@/lib/config";
import { useLocale } from "@/lib/Locale/useLocale";
import { routes } from "@/router";

export function AuthLayout() {
	const { t } = useLocale("auth");
	const navigate = useNavigate();
	const { queryClient, authClient, store } = useAppContext();

	useEffect(() => {
		async function init() {
			try {
				const res = await queryClient.fetchQuery(authClient.queryMe({}));
				store.set("auth", res);
				await navigate(routes.dashboard);
			} catch {}
		}

		void init();
	}, [queryClient, authClient, store, navigate]);

	const tosLabel = t("tos.label");

	return (
		<>
			<AppHeader />
			<div className="flex h-full flex-col items-center p-6 md:p-10">
				<div className="w-full max-w-md">
					<h1 className="text-primary pt-12 pb-6 text-center text-6xl leading-none font-black">
						{CONFIG.appTitle}
					</h1>

					<div className="flex flex-col gap-6">
						<Outlet />
						<p className="text-foreground/70 hover:text-foreground cursor-pointer text-center text-sm whitespace-nowrap transition-all">
							{tosLabel}
						</p>
					</div>
				</div>
			</div>
		</>
	);
}
