import { X } from "@ozanarslan/corpus";
import { type } from "arktype";

import { StepEntity } from "@/Step/entities/StepEntity";

export type StepType = X.InferModel<typeof StepModel>;

export class StepModel {
	static readonly create = {
		body: StepEntity.schema.pick("body", "order", "recipeId"),
		response: StepEntity.schema,
	};

	static readonly update = {
		params: type({ id: "number" }),
		body: StepEntity.schema.pick("body", "order").partial().and(StepEntity.schema.pick("recipeId")),
		response: StepEntity.schema,
	};

	static readonly listByRecipe = {
		params: type({ id: "number" }),
		response: StepEntity.schema.array(),
	};
}
