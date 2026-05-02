import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";

import { useAppContext } from "@/app/AppContext";
import { StatsCard } from "@/app/Profile/Components/StatsCard";
import type { Events } from "@/lib/Events";
import { useLocale } from "@/locale/useLocale";

type Props = {
	onClickCreateFactory: Events.ClickFactory;
};

export function Sidebar(props: Props) {
	const { txt: txtLanding } = useLocale("landing", {
		welcome: ["welcome"],
		welcomeBack: ["welcomeBack"],
	});
	const { txt: txtRecipe } = useLocale("app", {
		create: ["create"],
	});
	const { profileClient } = useAppContext();
	const statsQuery = useQuery(profileClient.myStats());
	const handleClickCreate = props.onClickCreateFactory();

	const stats = statsQuery.data;
	const isNewUser = stats
		? new Date(stats.joined).toDateString() === new Date().toDateString()
		: false;
	const greeting = isNewUser ? txtLanding.welcome : txtLanding.welcomeBack;

	return (
		<>
			<aside className="hidden flex-col items-center gap-2 *:w-full lg:flex">
				<h1 className="text-foreground text-2xl font-black tracking-tight">
					{greeting} {stats?.name}.
				</h1>

				<div className="h-1" />

				{stats && <StatsCard stats={stats} />}

				<div className="h-1" />

				<button type="button" onClick={handleClickCreate} className="primary md">
					{txtRecipe.create}
				</button>
			</aside>

			{/* Floating Action for Mobile */}
			<div className="fixed right-6 bottom-6 z-100 lg:hidden">
				<div className="flex flex-col gap-3">
					<button
						type="button"
						onClick={handleClickCreate}
						className="square xl secondary animate_scale shadow-xl"
					>
						<PlusIcon />
					</button>
				</div>
			</div>
		</>
	);
}
