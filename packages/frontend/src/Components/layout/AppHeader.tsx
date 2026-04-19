import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2Icon, SunIcon, MoonIcon, GlobeIcon } from "lucide-react";
import { Link } from "react-router";

import { PersonAvatar } from "@/Components/PersonAvatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@/Components/ui/dropdown-menu";
import { useAppContext } from "@/Context/AppContext";
import { useTheme } from "@/Hooks/useTheme";
import { CONFIG } from "@/lib/CONFIG";
import { Events } from "@/lib/events";
import { LANG_OPTIONS } from "@/Locale/localeConfig";
import { useCommonLocale } from "@/Locale/useCommonLocale";
import { useLocale } from "@/Locale/useLocale";
import { routes } from "@/router";

export function AppHeader() {
	const { authClient } = useAppContext();
	const { i18n } = useLocale();
	const { t, txt } = useCommonLocale();
	const { theme, toggleTheme } = useTheme();
	const meQuery = useQuery(authClient.queryMe({}));
	const logoutMut = useMutation(authClient.logout());

	const iconClassName = "size-4";

	const handleLogout = Events.click<[], HTMLDivElement>((e) => {
		e.preventDefault();
		e.stopPropagation();
		logoutMut.mutate({});
	});

	return (
		<header className="bg-background/70 sticky top-0 z-50 flex h-12 max-w-[100vw] shrink-0 items-center justify-between">
			<div className="flex items-center px-4 lg:px-12">
				<Link to={meQuery.data ? routes.dashboard : routes.landing}>
					<h1 className="text-lg font-bold">{CONFIG.appTitle}</h1>
				</Link>
			</div>
			<div className="flex items-center gap-2 px-4">
				<DropdownMenu
					trigger={
						<button className="icon outlined">
							<GlobeIcon />
						</button>
					}
				>
					<DropdownMenuContent side="bottom" align="end">
						{LANG_OPTIONS.map((lang) => (
							<DropdownMenuItem key={lang} onClick={() => i18n.changeLanguage(lang)}>
								{t(`languages.${lang}`)}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>

				<button onClick={toggleTheme} className="icon outlined">
					{theme === "dark" ? (
						<SunIcon className={iconClassName} />
					) : (
						<MoonIcon className={iconClassName} />
					)}
				</button>

				{meQuery.isPending ? (
					<button className="outlined sm">
						<Loader2Icon className={iconClassName} />
					</button>
				) : meQuery.error ? (
					<Link className="button outlined sm" to={routes.login}>
						{txt.login}
					</Link>
				) : (
					<DropdownMenu
						trigger={
							<button className="outlined sm">
								<span className="inline-flex items-center gap-2">
									<PersonAvatar person={meQuery.data} className="size-5.5 rounded-full text-xs" />
									<span>{meQuery.data.name}</span>
								</span>
							</button>
						}
					>
						<DropdownMenuContent side="bottom" align="end">
							<DropdownMenuItem onClick={handleLogout()}>{txt.logout}</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>
		</header>
	);
}
