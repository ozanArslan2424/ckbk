import { PlusIcon } from "lucide-react";

import { useAppContext } from "@/Context/AppContext";
import type { Events } from "@/lib/events";
import { useLocale } from "@/Locale/useLocale";

type Props = {
	onClickCreate: Events.ClickHandler;
};

export function Sidebar(props: Props) {
	const { txt: txtLanding } = useLocale("landing", {
		welcomeBack: ["welcomeBack"],
	});
	const { txt: txtRecipe } = useLocale("app", {
		create: ["create"],
	});
	const { store } = useAppContext();

	return (
		<>
			<aside className="hidden flex-col items-center gap-2 *:w-full lg:flex">
				<h1 className="text-foreground text-2xl font-black tracking-tight">
					{txtLanding.welcomeBack} {store.get("auth")?.name}.
				</h1>

				<div className="h-1" />

				<button onClick={props.onClickCreate} className="primary md">
					{txtRecipe.create}
				</button>
			</aside>

			{/* Floating Action for Mobile */}
			<div className="fixed right-6 bottom-6 z-100 lg:hidden">
				<div className="flex flex-col gap-3">
					<button
						onClick={props.onClickCreate}
						className="square xl secondary animate_scale shadow-xl"
					>
						<PlusIcon />
					</button>
				</div>
			</div>
		</>
	);
}
