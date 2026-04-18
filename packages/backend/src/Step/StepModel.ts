import { X } from "@ozanarslan/corpus";
import { type } from "arktype";

import { StepEntity } from "@/Step/StepEntity";

export type StepType = X.InferModel<typeof StepModel>;

export class StepModel {
	static create = {
		body: StepEntity.schema.pick("body", "order", "recipeId"),
		response: StepEntity.schema,
	};

	static listByRecipe = {
		params: type({ recipeId: type("string").pipe(Number) }),
		response: StepEntity.schema.array(),
	};
}
