import { C } from "@ozanarslan/corpus";

export const RecipeException = {
	notFound: new C.Exception("recipe.notFound", C.Status.NOT_FOUND),

	translations: {
		notFound: {
			"en-US": "Recipe not found",
			tr: "Tarif bulunamadı",
		},
	},
};
