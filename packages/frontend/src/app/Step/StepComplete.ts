import type { Entities } from "@/lib/CorpusApi";

export type StepComplete = Required<Pick<Entities.Step, "id" | "order" | "body">>;

export type StepPatch = Partial<StepComplete>;

export type StepDraft = StepPatch & { id: number; order: number };

export function isStepComplete(s: StepDraft): s is StepComplete {
	return typeof s.body === "string" && s.body.trim().length > 0;
}
