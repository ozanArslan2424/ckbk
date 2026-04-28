import { PlusIcon } from "lucide-react";

import type { useCookbookForm } from "@/app/Cookbook/useCookbookForm";
import { useCardDeckContext } from "@/components/cards/CardDeck";
import { FormCard } from "@/components/form/FormCard";
import { Tooltip } from "@/components/ui/tooltip";
import { useCommonLocale } from "@/hooks/useCommonLocale";
import { useDragDrop } from "@/hooks/useDragDrop";
import { useLocale } from "@/hooks/useLocale";
import { cn, repeat } from "@/lib/utils";

type StepFormProps = {
	form: ReturnType<typeof useCookbookForm>;
};

export function RecipeFormPartThree({ form }: StepFormProps) {
	const { txt: txtCommon } = useCommonLocale();
	const { txt } = useLocale("app", {
		addStep: ["form.step.add"],
		steps: ["form.step.title"],
		stepPlaceholder: ["form.step.placeholder"],
		minStepTip: ["form.step.min"],
	});
	const ctx = useCardDeckContext();

	const dnd = useDragDrop<number>({
		onDrop: (source, target) => {
			const from = source.sourceId;
			const to = target.targetId;
			if (from !== to) form.handleMoveStep(from, to);
		},
	});

	return (
		<>
			<div
				className="bg-background flex w-100 items-start gap-2 rounded-md border p-2 shadow-lg"
				{...dnd.ghost()}
			>
				<div className="text-muted-foreground/50 flex h-full items-center justify-center">
					<svg
						width="20"
						height="20"
						viewBox="0 0 16 16"
						fill="currentColor"
						className="pointer-events-none"
					>
						<circle cx="5" cy="4" r="1.25" />
						<circle cx="5" cy="8" r="1.25" />
						<circle cx="5" cy="12" r="1.25" />
						<circle cx="10" cy="4" r="1.25" />
						<circle cx="10" cy="8" r="1.25" />
						<circle cx="10" cy="12" r="1.25" />
					</svg>
				</div>
				<textarea
					className="min-h-20 w-full resize-y"
					placeholder={txt.stepPlaceholder}
					value={dnd.sourceId !== null ? form.steps[dnd.sourceId]?.body : ""}
					readOnly
					tabIndex={-1}
				/>
			</div>

			<FormCard
				title={txt.steps}
				cornerSlot={
					<span className="bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 text-xs font-medium">
						{form.stepCount}
					</span>
				}
				footer={
					ctx ? (
						<>
							<button type="button" onClick={ctx.onPrev} className="secondary w-max">
								{txtCommon.previous}
							</button>
							<Tooltip tip={txt.minStepTip}>
								<button
									type="button"
									disabled={form.steps.length < 1 || form.stepAddDisabled}
									onClick={ctx.onNext}
									className="w-max"
								>
									{txtCommon.submit}
								</button>
							</Tooltip>
						</>
					) : null
				}
			>
				{repeat(form.stepCount).map((i) => (
					<div
						key={i}
						className={cn(
							"flex items-start gap-2 rounded-md transition-opacity",
							dnd.isDragged(i) ? "opacity-40" : "opacity-100",
							dnd.isOver(i) ? "ring-primary ring-2 ring-offset-1" : "",
						)}
						{...dnd.target({ targetId: i })}
					>
						{/* Drag handle */}
						<div
							className="text-muted-foreground/50 hover:text-muted-foreground flex h-full cursor-grab items-center justify-center active:cursor-grabbing"
							{...dnd.source({ sourceId: i })}
							title={`Step ${i + 1}`}
						>
							<svg
								width="20"
								height="20"
								viewBox="0 0 16 16"
								fill="currentColor"
								className="pointer-events-none"
							>
								<circle cx="5" cy="4" r="1.25" />
								<circle cx="5" cy="8" r="1.25" />
								<circle cx="5" cy="12" r="1.25" />
								<circle cx="10" cy="4" r="1.25" />
								<circle cx="10" cy="8" r="1.25" />
								<circle cx="10" cy="12" r="1.25" />
							</svg>
						</div>

						<textarea
							className="min-h-20 w-full resize-y"
							id={`step-${i}-body`}
							name={`step-${i}-body`}
							placeholder={txt.stepPlaceholder}
							value={form.steps[i]?.body ?? ""}
							onChange={(e) => form.handleWriteStep(i, e.target.value)}
							autoFocus
						/>
					</div>
				))}

				<button
					type="button"
					className="secondary"
					onClick={form.handleAddStep}
					disabled={form.stepAddDisabled}
				>
					<PlusIcon />
					{txt.addStep}
				</button>
			</FormCard>
		</>
	);
}
