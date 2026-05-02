import { useAppContext } from "@/app/AppContext";
import { Modal } from "@/components/modals/Modal";
import { useDate } from "@/hooks/useDate";
import type { ModalState } from "@/hooks/useModal";
import type { Entities } from "@/lib/CorpusApi";
import type { Events } from "@/lib/Events";
import { useLocale } from "@/locale/useLocale";

type RecipeDetailsModalProps = {
	modal: ModalState<Entities.Cookbook>;
	onClickUpdateFactory: Events.Factory<Events.ClickEvent, [Entities.Recipe]>;
};

export function RecipeDetailsModal(props: RecipeDetailsModalProps) {
	const { store } = useAppContext();
	const { timestamp } = useDate();
	const { txt } = useLocale("app", {
		yourRecipe: ["yourRecipe"],
		recipe: ["recipe"],
		steps: ["steps"],
		ingredients: ["ingredients"],
		update: ["update"],
		updatedAt: ["updatedAt", { date: timestamp(props.modal.data?.updatedAt).shortDate }],
	});

	if (!props.modal.data) return null;
	const entry = props.modal.data;
	const isOwner = store.get("auth")?.id === entry.profileId;
	const handleClickUpdate = props.onClickUpdateFactory(entry);

	return (
		<Modal
			{...props.modal}
			title={props.modal.data.title}
			description={props.modal.data.description}
			showCloseButton
			className="w-full sm:max-w-6xl"
		>
			<div className="grid min-h-96 w-full grid-cols-1 overflow-y-auto md:grid-cols-3">
				{/* Column 1 — Details */}
				<div className="col-span-1">
					<div className="flex flex-col overflow-y-auto p-6">
						<div className="bg-muted relative aspect-square overflow-hidden rounded-t-lg md:rounded-lg">
							{entry.image ? (
								<img
									src={entry.image}
									alt={entry.title}
									className="h-full w-full rounded-md object-cover"
								/>
							) : (
								<div className="flex h-full w-full items-center justify-center">
									<svg
										className="text-muted-foreground/20 size-12"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="1"
									>
										<rect x="3" y="3" width="18" height="18" rx="2" />
										<circle cx="8.5" cy="8.5" r="1.5" />
										<path d="m21 15-5-5L5 21" />
									</svg>
								</div>
							)}
							{isOwner && (
								<div className="absolute top-2 left-2 flex items-center gap-2">
									<div className="bg-accent text-accent-foreground flex items-center justify-center rounded-md px-2.5 py-1.5 text-xs font-semibold tracking-tight">
										{txt.yourRecipe}
									</div>
								</div>
							)}
						</div>
						<div className="flex flex-1 flex-col gap-3 p-5">
							<h2>{entry.title}</h2>
							<p className="min-h-10 text-sm opacity-80">{entry.description}</p>
							{isOwner && (
								<button onClick={handleClickUpdate} type="button" className="sm outlined">
									{txt.update}
								</button>
							)}
							<p className="text-muted-foreground mt-auto text-xs">{txt.updatedAt}</p>
						</div>
					</div>
				</div>

				{/* Column 2 — Steps */}
				<div className="col-span-1 border-x-0 border-t border-b md:border-x md:border-t-0 md:border-b-0">
					<div className="flex flex-col overflow-y-auto p-6">
						<section>
							<h3 className="text-muted-foreground mb-3 text-xs font-semibold tracking-widest uppercase">
								{txt.steps}
							</h3>
							<ol className="flex flex-col gap-4">
								{entry.steps.map((step) => (
									<li key={step.id} className="flex gap-3 text-sm">
										<span className="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
											{step.order}
										</span>
										<p className="pt-0.5 leading-relaxed">{step.body}</p>
									</li>
								))}
							</ol>
						</section>
					</div>
				</div>

				{/* Column 3 — Ingredients */}
				<div className="col-span-1">
					<div className="flex flex-col overflow-y-auto p-6">
						<section>
							<h3 className="text-muted-foreground mb-3 text-xs font-semibold tracking-widest uppercase">
								{txt.ingredients}
							</h3>
							<ul className="flex flex-col gap-1.5">
								{entry.ingredients.map((ing) => (
									<li
										key={ing.id}
										className="bg-muted flex items-center justify-between rounded-md px-3 py-2 text-sm"
									>
										<span className="font-semibold">{ing.material}</span>
										<span className="text-muted-foreground">
											{ing.quantity} {ing.measurement}
										</span>
									</li>
								))}
							</ul>
						</section>
					</div>
				</div>
			</div>
		</Modal>
	);
}
