import { useMutation } from "@tanstack/react-query";
import { useReducer } from "react";
import { toast } from "sonner";

import { useAppContext } from "@/app/AppContext";
import type { IngredientComplete } from "@/app/Ingredient/Types/IngredientComplete";
import { useRecipeGetArgs } from "@/app/Recipe/Hooks/useRecipeGetArgs";
import type { StepComplete } from "@/app/Step/Types/StepComplete";
import { useLocale } from "@/hooks/useLocale";
import { Entities } from "@/lib/CorpusApi";
import { Help } from "@/lib/Help";

export type CookBookEntryFormState = {
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

const initialState: CookBookEntryFormState = {
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
			payload: CookBookEntryFormState["ingredients"][number];
	  }
	| { type: "WRITE_STEP"; payload: { index: number; body: string } }
	| { type: "INCREASE_INGREDIENT_COUNT" }
	| { type: "INCREASE_STEP_COUNT" }
	| { type: "CHANGE_IMAGE"; payload: File }
	| { type: "REMOVE_IMAGE" }
	| { type: "CHANGE_TITLE"; payload: CookBookEntryFormState["title"] }
	| { type: "CHANGE_DESCRIPTION"; payload: CookBookEntryFormState["description"] }
	| { type: "CHANGE_IS_PUBLIC"; payload: CookBookEntryFormState["isPublic"] }
	| { type: "MOVE_STEP"; payload: { from: number; to: number } }
	| { type: "SET"; payload: CookBookEntryFormState }
	| { type: "RESET" };

function reducer(state: CookBookEntryFormState, action: Action): CookBookEntryFormState {
	switch (action.type) {
		case "ADD_INGREDIENT": {
			const exists = state.ingredients.findIndex((i) => i.id === action.payload.id);
			return {
				...state,
				ingredientAddDisabled: false,
				ingredients:
					exists !== -1
						? state.ingredients.map((i, idx) => (idx === exists ? action.payload : i))
						: [...state.ingredients, action.payload],
			};
		}

		case "WRITE_STEP":
			return {
				...state,
				stepAddDisabled: false,
				steps: state.steps[action.payload.index]
					? state.steps.map((step, i) =>
							i === action.payload.index ? { ...step, body: action.payload.body } : step,
						)
					: [
							...state.steps,
							{ id: -state.stepCount, body: action.payload.body, order: state.steps.length + 1 },
						],
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

export function useCookBookForm(onSuccess?: () => void, onReset?: () => void) {
	const [state, dispatch] = useReducer(reducer, initialState);
	const { recipeGetArgs } = useRecipeGetArgs();
	const { cookbookClient, recipeClient, ingredientClient, stepClient } = useAppContext();
	const { txt } = useLocale("app", {
		createSuccess: ["success.create"],
		updateSuccess: ["success.update"],
	});

	const createMut = useMutation(
		cookbookClient.create({
			onSuccess(res) {
				toast.success(txt.createSuccess);
				onSuccess?.();
				dispatch({ type: "RESET" });
				recipeClient.addToList(recipeGetArgs, res); // extra keys shouldn't be an issue
				const otherArgs = { params: { id: res.id } };
				res.ingredients.forEach((it) => ingredientClient.addToList(otherArgs, it));
				res.steps.forEach((it) => stepClient.addToList(otherArgs, it));
			},
		}),
	);

	const updateMut = useMutation(
		cookbookClient.update({
			onSuccess(res, vars) {
				toast.success(txt.updateSuccess);
				onSuccess?.();
				recipeClient.updateInList(recipeGetArgs, vars.params.id, () => res);
				const otherArgs = { params: { id: vars.params.id } };
				ingredientClient.clearList(otherArgs); // finding and replacing is too surgical
				stepClient.clearList(otherArgs); // finding and replacing is too surgical
				res.ingredients.forEach((it) => ingredientClient.addToList(otherArgs, it));
				res.steps.forEach((it) => stepClient.addToList(otherArgs, it));
			},
		}),
	);

	function handleCreate() {
		const formData = new FormData();
		formData.set("title", state.title);
		formData.set("description", state.description);
		formData.set("isPublic", Help.toStringBoolean(state.isPublic));
		if (state.image) formData.set("image", state.image);

		for (const [i, { id: _, ...rest }] of state.ingredients.entries()) {
			formData.append(`ingredients[${i}]`, JSON.stringify(rest));
		}

		for (const [i, { id: _, ...rest }] of state.steps.entries()) {
			formData.append(`steps[${i}]`, JSON.stringify(rest));
		}

		createMut.mutate({ formData });
	}

	function handleUpdate(prev: Entities.Cookbook) {
		const formData = new FormData();

		if (state.title !== prev.title) formData.set("title", state.title);
		if (state.description !== prev.description) formData.set("description", state.description);
		if (state.isPublic !== prev.isPublic)
			formData.set("isPublic", Help.toStringBoolean(state.isPublic));
		if (state.image instanceof File) formData.set("image", state.image);

		const currIngredientIds = new Set(state.ingredients.map((i) => i.id));

		const changedIngredients = state.ingredients.filter((i) => {
			if (i.id < 0) return false;
			const prev_ = prev.ingredients.find((p) => p.id === i.id);
			if (!prev_) return false;
			return (
				prev_.materialId !== i.materialId ||
				prev_.measurementId !== i.measurementId ||
				prev_.quantity !== i.quantity
			);
		});

		const deletedIngredientIds = [
			...prev.ingredients.filter((i) => !currIngredientIds.has(i.id)).map((i) => i.id),
			...changedIngredients.map((i) => i.id),
		];
		for (const [i, id] of deletedIngredientIds.entries()) {
			formData.append(`deletedIngredientIds[${i}]`, id.toString());
		}

		const newIngredients = [...state.ingredients.filter((i) => i.id < 0), ...changedIngredients];
		for (const [i, { id: _, ...rest }] of newIngredients.entries()) {
			formData.append(`newIngredients[${i}]`, JSON.stringify(rest));
		}

		const currStepIds = new Set(state.steps.map((s) => s.id));
		const deletedStepIds = prev.steps.filter((s) => !currStepIds.has(s.id)).map((s) => s.id);
		for (const [i, id] of deletedStepIds.entries()) {
			formData.append(`deletedStepIds[${i}]`, id.toString());
		}

		const newSteps = state.steps.filter((s) => s.id < 0);
		for (const [i, { id: _, ...rest }] of newSteps.entries()) {
			formData.append(`newSteps[${i}]`, JSON.stringify(rest));
		}

		const updatedSteps = state.steps.filter((s) => {
			if (s.id < 0) return false;
			const prev_ = prev.steps.find((p) => p.id === s.id);
			if (!prev_) return false;
			return prev_.body !== s.body || prev_.order !== s.order;
		});
		for (const [i, { id, order, body }] of updatedSteps.entries()) {
			formData.append(`updatedSteps[${i}]`, JSON.stringify({ id, order, body }));
		}

		const hasNoChanges =
			!formData.has("title") &&
			!formData.has("description") &&
			!formData.has("isPublic") &&
			!formData.has("image") &&
			deletedIngredientIds.length === 0 &&
			deletedStepIds.length === 0 &&
			newIngredients.length === 0 &&
			newSteps.length === 0;

		if (hasNoChanges) return;

		updateMut.mutate({ params: { id: prev.id }, formData });
	}

	function handleReset() {
		dispatch({ type: "RESET" });
		onReset?.();
	}

	function isIngredientComplete(ing: Partial<IngredientComplete>): ing is IngredientComplete {
		return (
			ing.materialId !== undefined &&
			ing.measurementId !== undefined &&
			ing.quantity !== undefined &&
			Number.isFinite(ing.quantity) &&
			ing.quantity > 0
		);
	}

	return { ...state, dispatch, handleCreate, handleUpdate, handleReset, isIngredientComplete };
}
