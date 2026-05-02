import { C } from "@ozanarslan/corpus";

export const IngredientException = {
	differentOwner: new C.Exception("ingredient.differentOwner", C.Status.FORBIDDEN),

	translations: {
		differentOwner: {
			"en-US": "Cannot add ingredients to someone else's recipe.",
			tr: "Başkasının tarifine malzeme ekleyemezsiniz.",
		},
	},
};
