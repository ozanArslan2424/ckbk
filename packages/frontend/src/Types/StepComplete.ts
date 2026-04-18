import type { Entities } from "@/Api/CorpusApi";

export type StepComplete = Required<Pick<Entities.Step, "order" | "body">>;
