import { useMutation } from "@tanstack/react-query";
import { useReducer } from "react";
import { toast } from "sonner";

import { useRecipeListArgs } from "@/App/Recipe/Hooks/useRecipeListArgs";
import { useAppContext } from "@/Context/AppContext";
import { Help } from "@/lib/Help";
import { getErrorMessage } from "@/lib/utils";
import type { IngredientComplete } from "@/Types/IngredientComplete";
import type { StepComplete } from "@/Types/StepComplete";

export type CookbookFormState = {
	ingredients: IngredientComplete[];
	ingredientCount: number;
	ingredientAddDisabled: boolean;
	steps: StepComplete[];
	stepCount: number;
	stepAddDisabled: boolean;
	image: File | string | null;
	title: string;
	description: string;
	isPublic: boolean;
};

const initialState: CookbookFormState = {
	ingredients: [],
	ingredientCount: 1,
	ingredientAddDisabled: false,
	steps: [],
	stepCount: 1,
	stepAddDisabled: false,
	image: null,
	title: "",
	description: "",
	isPublic: false,
};

type Action =
	| {
			type: "ADD_INGREDIENT";
			payload: CookbookFormState["ingredients"][number];
	  }
	| { type: "WRITE_STEP"; payload: { index: number; body: string } }
	| { type: "INCREASE_INGREDIENT_COUNT" }
	| { type: "INCREASE_STEP_COUNT" }
	| { type: "CHANGE_IMAGE"; payload: File }
	| { type: "REMOVE_IMAGE" }
	| { type: "CHANGE_TITLE"; payload: CookbookFormState["title"] }
	| { type: "CHANGE_DESCRIPTION"; payload: CookbookFormState["description"] }
	| { type: "CHANGE_IS_PUBLIC"; payload: CookbookFormState["isPublic"] }
	| { type: "MOVE_STEP"; payload: { from: number; to: number } }
	| { type: "SET"; payload: CookbookFormState }
	| { type: "RESET" };

function reducer(state: CookbookFormState, action: Action): CookbookFormState {
	switch (action.type) {
		case "ADD_INGREDIENT":
			return {
				...state,
				ingredientAddDisabled: false,
				ingredients: [...state.ingredients, action.payload],
			};

		case "WRITE_STEP":
			return {
				...state,
				stepAddDisabled: false,
				steps: state.steps[action.payload.index]
					? state.steps.map((step, i) =>
							i === action.payload.index ? { ...step, body: action.payload.body } : step,
						)
					: [...state.steps, { body: action.payload.body, order: state.steps.length + 1 }],
			};

		case "MOVE_STEP": {
			const steps = [...state.steps];
			[steps[action.payload.from], steps[action.payload.to]] = [
				steps[action.payload.to],
				steps[action.payload.from],
			];
			return { ...state, steps: steps.map((s, i) => ({ ...s, order: i + 1 })) };
		}

		case "INCREASE_INGREDIENT_COUNT":
			return {
				...state,
				ingredientAddDisabled: true,
				ingredientCount: state.ingredientCount + 1,
			};

		case "INCREASE_STEP_COUNT":
			return {
				...state,
				stepAddDisabled: true,
				stepCount: state.stepCount + 1,
			};

		case "CHANGE_IMAGE":
			return { ...state, image: action.payload };

		case "REMOVE_IMAGE":
			return { ...state, image: null };

		case "CHANGE_TITLE":
			return { ...state, title: action.payload };

		case "CHANGE_DESCRIPTION":
			return { ...state, description: action.payload };

		case "CHANGE_IS_PUBLIC":
			return { ...state, isPublic: action.payload };

		case "SET":
			return action.payload;

		case "RESET":
			return initialState;

		default:
			return state;
	}
}

export function useCookbookForm(onSuccess?: () => void, defaultValues?: CookbookFormState) {
	const { listArgs } = useRecipeListArgs();
	const [state, dispatch] = useReducer(reducer, defaultValues ?? initialState);
	const { api, recipeClient } = useAppContext();

	const recipeCreateMut = useMutation(
		recipeClient.create({
			listArgs,
			async onSuccess(res) {
				try {
					const ingPromises = state.ingredients.map((ing) =>
						api.ingredientPost({
							body: {
								quantity: ing.quantity,
								materialId: ing.materialId,
								measurementId: ing.measurementId,
								recipeId: res.id,
							},
						}),
					);
					const stepPromises = state.steps.map((step) =>
						api.stepPost({
							body: {
								order: step.order,
								body: step.body,
								recipeId: res.id,
							},
						}),
					);
					await Promise.all([...ingPromises, ...stepPromises]);
					toast.success("New entry added to the ckbk!");
					onSuccess?.();
					dispatch({ type: "RESET" });
				} catch (err) {
					console.error(err);
					toast.error(getErrorMessage(err));
				}
			},
		}),
	);

	function handleCreate() {
		const formData = new FormData();
		formData.set("title", state.title);
		formData.set("description", state.description);
		formData.set("isPublic", Help.toStringBoolean(state.isPublic));
		if (state.image) formData.set("image", state.image);
		recipeCreateMut.mutate({ formData });
	}

	function handleUpdate() {
		const formData = new FormData();
		formData.set("title", state.title);
		formData.set("description", state.description);
		formData.set("isPublic", Help.toStringBoolean(state.isPublic));
		if (state.image) formData.set("image", state.image);
		recipeCreateMut.mutate({ formData });
	}

	return { ...state, dispatch, handleCreate, handleUpdate };
}
