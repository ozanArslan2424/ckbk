import { useQuery } from "@tanstack/react-query";
import { Loader2Icon, SunIcon, MoonIcon } from "lucide-react";
import { Link, useNavigate } from "react-router";

import { PersonAvatar } from "@/Components/ui/person-avatar";
import { useAppContext } from "@/Context/AppContext";
import { useTheme } from "@/Hooks/useTheme";
import { CONFIG } from "@/lib/config";
import { useLocale } from "@/lib/Locale/useLocale";
import { routes } from "@/router";

export function AppHeader() {
	const { authClient } = useAppContext();
	const { t } = useLocale("common");
	const meQuery = useQuery(authClient.queryMe({}));
	const navigate = useNavigate();
	const { theme, toggleTheme } = useTheme();
	const iconClassName = "size-4";

	return (
		<header className="bg-background/70 sticky top-0 z-50 flex h-12 max-w-[100vw] shrink-0 items-center justify-between">
			<div className="flex items-center px-4 lg:px-12">
				<Link to={meQuery.data ? routes.dashboard : routes.landing}>
					<h1 className="text-lg font-bold">{CONFIG.appTitle}</h1>
				</Link>
			</div>
			<div className="flex items-center gap-2 px-4">
				<button onClick={toggleTheme} className="icon outlined">
					{theme === "dark" ? (
						<SunIcon className={iconClassName} />
					) : (
						<MoonIcon className={iconClassName} />
					)}
				</button>
				<button
					className="outlined sm"
					onClick={meQuery.error ? () => navigate(routes.login) : undefined}
				>
					{meQuery.isPending ? (
						<Loader2Icon className={iconClassName} />
					) : meQuery.error ? (
						t("login")
					) : (
						<span className="inline-flex items-center gap-2">
							<PersonAvatar person={meQuery.data} className="size-5.5 rounded-full text-xs" />
							<span>{meQuery.data.name}</span>
						</span>
					)}
				</button>
			</div>
		</header>
	);
}
