import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2Icon, SunIcon, MoonIcon, GlobeIcon } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router";

import { useAppContext } from "@/app/AppContext";
import { PersonAvatar } from "@/components/PersonAvatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/useTheme";
import { CONFIG } from "@/lib/CONFIG";
import { Events } from "@/lib/Events";
import { LOCALE_OPTIONS } from "@/locale/Locale";
import { useCommonLocale } from "@/locale/useCommonLocale";
import { useLocale } from "@/locale/useLocale";
import { routes } from "@/router";

export function AppHeader() {
	const { authClient, profileClient } = useAppContext();
	const { changeLanguage } = useLocale();
	const { t, txt } = useCommonLocale();
	const { theme, toggleTheme } = useTheme();
	const meQuery = useQuery(profileClient.get({}));
	const logoutMut = useMutation(authClient.logout());

	useEffect(() => {
		console.log(meQuery.data);
		console.log(meQuery.isPending);
		console.log(meQuery.error);
	}, [meQuery.isPending, meQuery.data, meQuery.error]);

	const onLogoutFactory = Events.click<[], HTMLDivElement>((e) => {
		e.preventDefault();
		e.stopPropagation();
		logoutMut.mutate({});
	});

	const handleLogout = onLogoutFactory();

	return (
		<header className="border-border/50 bg-background/80 sticky top-0 z-50 flex h-14 max-w-[100vw] shrink-0 items-center justify-between border-b backdrop-blur-md">
			<div className="flex items-center gap-2 px-4 lg:px-8">
				<Link
					to={meQuery.data ? routes.dashboard : routes.landing}
					className="group flex items-center gap-2"
				>
					<span className="bg-primary size-2 rounded-full transition-transform duration-200 group-hover:scale-125" />
					<h1 className="text-foreground text-base font-black tracking-tight">{CONFIG.appTitle}</h1>
				</Link>
			</div>

			<div className="flex items-center gap-2 px-4 lg:px-8">
				<button type="button" onClick={toggleTheme} className="icon outlined neon">
					{theme === "dark" ? <SunIcon /> : <MoonIcon />}
				</button>

				<DropdownMenu>
					<DropdownMenuTrigger>
						<button type="button" className="icon outlined neon">
							<GlobeIcon />
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent side="bottom" align="end">
						{LOCALE_OPTIONS.map((lang) => (
							<DropdownMenuItem key={lang} onClick={() => changeLanguage(lang)}>
								{t(`languages.${lang}`)}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>

				{meQuery.isPending ? (
					<button type="button" className="outlined neon sm" disabled>
						<Loader2Icon className="animate-spin" />
					</button>
				) : meQuery.error ? (
					<Link className="button sm" to={routes.login}>
						{txt.login}
					</Link>
				) : (
					<DropdownMenu>
						<DropdownMenuTrigger>
							<button type="button" className="outlined neon sm gap-2">
								<PersonAvatar person={meQuery.data} className="size-5 rounded-full text-xs" />
								<span className="max-w-28 truncate">{meQuery.data.name}</span>
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent side="bottom" align="end">
							<DropdownMenuItem variant="destructive" onClick={handleLogout}>
								{txt.logout}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>
		</header>
	);
}
