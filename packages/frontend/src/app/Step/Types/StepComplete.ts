import type { Entities } from "@/lib/CorpusApi";

export type StepComplete = Required<Pick<Entities.Step, "id" | "order" | "body">>;
