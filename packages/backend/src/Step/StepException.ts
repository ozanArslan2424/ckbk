import { C } from "@ozanarslan/corpus";

export const StepException = {
	differentOwner: new C.Exception("step.differentOwner", C.Status.FORBIDDEN),

	translations: {
		differentOwner: {
			"en-US": "Cannot add steps to someone else's recipe.",
			tr: "Başkasının tarifine adım ekleyemezsiniz.",
		},
	},
};
