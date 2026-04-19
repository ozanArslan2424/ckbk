import { useCardDeckContext } from "@/Components/CardDeck";
import { FormCard } from "@/Components/form/FormCard";
import { Tooltip } from "@/Components/ui/tooltip";
import { useDnd } from "@/Hooks/useDnd";
import { cn, repeat } from "@/lib/utils";
import { useCommonLocale } from "@/Locale/useCommonLocale";
import { useLocale } from "@/Locale/useLocale";
import type { StepComplete } from "@/Types/StepComplete";

type StepFormProps = {
	addDisabled: boolean;
	steps: StepComplete[];
	stepCount: number;
	onAddStep: () => void;
	onMoveStep: (fromIndex: number, toIndex: number) => void;
	onWriteStep: (index: number, body: string) => void;
};

export function RecipeFormPartThree({
	addDisabled,
	steps,
	stepCount,
	onAddStep,
	onMoveStep,
	onWriteStep,
}: StepFormProps) {
	const { txt: txtCommon } = useCommonLocale();
	const { txt } = useLocale("app", {
		addStep: ["form.step.add"],
		steps: ["form.step.title"],
		stepPlaceholder: ["form.step.placeholder"],
		minStepTip: ["form.step.min"],
	});
	const ctx = useCardDeckContext();

	const dnd = useDnd({
		onDrop: (source, target) => {
			const from = parseInt(source.sourceId);
			const to = parseInt(target.targetId);
			if (from !== to) onMoveStep(from, to);
		},
	});

	return (
		<FormCard
			title={txt.steps}
			cornerSlot={
				<span className="bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 text-xs font-medium">
					{stepCount}
				</span>
			}
			footer={
				ctx ? (
					<>
						<button onClick={ctx.onPrev} className="secondary w-max">
							{txtCommon.previous}
						</button>
						<Tooltip tip={txt.minStepTip}>
							<button disabled={steps.length < 1} onClick={ctx.onNext} className="secondary w-max">
								{txtCommon.submit}
							</button>
						</Tooltip>
					</>
				) : null
			}
		>
			{repeat(stepCount).map((i) => (
				<div
					key={i}
					className={cn(
						"flex items-start gap-2 rounded-md transition-opacity",
						dnd.getIsDragged(String(i)) ? "opacity-40" : "opacity-100",
						dnd.getIsOver(String(i)) ? "ring-primary ring-2 ring-offset-1" : "",
					)}
					{...dnd.registerTarget({ targetId: String(i) })}
				>
					{/* Drag handle */}
					<div
						className="text-muted-foreground/50 hover:text-muted-foreground flex h-full cursor-grab items-center justify-center active:cursor-grabbing"
						{...dnd.registerSource({ sourceId: String(i) })}
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
						value={steps[i]?.body ?? ""}
						onChange={(e) => onWriteStep(i, e.target.value)}
					/>
				</div>
			))}

			<button className="secondary" onClick={onAddStep} disabled={addDisabled}>
				<svg
					className="size-4"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
				>
					<path d="M12 5v14M5 12h14" />
				</svg>
				{txt.addStep}
			</button>
		</FormCard>
	);
}
