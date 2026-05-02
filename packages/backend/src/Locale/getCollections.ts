import { AuthException } from "@/Auth/AuthException";
import { DatabaseException } from "@/Database/DatabaseException";
import { addToCollection } from "@/Locale/addToCollection";
import baseError from "@/Locale/locales/error";
import otp from "@/Locale/locales/otp";
import verification from "@/Locale/locales/verification";
import { RecipeException } from "@/Recipe/RecipeException";
import { StepException } from "@/Step/StepException";

export function getCollections() {
	let error = baseError;
	error = addToCollection(error, "prisma", DatabaseException.translations);
	error = addToCollection(error, "auth", AuthException.translations);
	error = addToCollection(error, "recipe", RecipeException.translations);
	error = addToCollection(error, "step", StepException.translations);
	error = addToCollection(error, "ingredient", StepException.translations);

	return {
		error,
		otp,
		verification,
	};
}
