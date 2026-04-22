import { PlusIcon } from "lucide-react";

import { useAppContext } from "@/app/AppContext";
import { useLocale } from "@/hooks/useLocale";
import type { Events } from "@/lib/Events";

type Props = {
	onClickCreateFactory: Events.ClickFactory;
};

export function Sidebar(props: Props) {
	const { txt: txtLanding } = useLocale("landing", {
		welcomeBack: ["welcomeBack"],
	});
	const { txt: txtRecipe } = useLocale("app", {
		create: ["create"],
	});
	const { store } = useAppContext();

	const handleClickCreate = props.onClickCreateFactory();

	return (
		<>
			<aside className="hidden flex-col items-center gap-2 *:w-full lg:flex">
				<h1 className="text-foreground text-2xl font-black tracking-tight">
					{txtLanding.welcomeBack} {store.get("auth")?.name}.
				</h1>

				<div className="h-1" />

				<button onClick={handleClickCreate} className="primary md">
					{txtRecipe.create}
				</button>
			</aside>

			{/* Floating Action for Mobile */}
			<div className="fixed right-6 bottom-6 z-100 lg:hidden">
				<div className="flex flex-col gap-3">
					<button
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
