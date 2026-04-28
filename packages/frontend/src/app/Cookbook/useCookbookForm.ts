import { useMutation } from "@tanstack/react-query";
import { useReducer } from "react";
import { toast } from "sonner";

import { useAppContext } from "@/app/AppContext";
import type { IngredientDraft, IngredientPatch } from "@/app/Ingredient/IngredientComplete";
import { isIngredientComplete } from "@/app/Ingredient/IngredientComplete";
import { useRecipeGetArgs } from "@/app/Recipe/useRecipeGetArgs";
import { isStepComplete, type StepDraft } from "@/app/Step/StepComplete";
import { useLocale } from "@/hooks/useLocale";
import { Entities } from "@/lib/CorpusApi";
import { Help } from "@/lib/Help";

type State = {
	ingredients: IngredientDraft[];
	ingredientCount: number;
	steps: StepDraft[];
	stepCount: number;
	image: File | string | null;
	title: string;
	description: string;
	isPublic: boolean;
};

const initialState: State = {
	ingredients: [],
	ingredientCount: 1,
	steps: [],
	stepCount: 1,
	image: null,
	title: "",
	description: "",
	isPublic: false,
};

type Action =
	| {
			type: "PATCH_INGREDIENT";
			payload: { index: number; patch: IngredientPatch };
	  }
	| { type: "WRITE_STEP"; payload: { index: number; body: string } }
	| { type: "INCREASE_INGREDIENT_COUNT" }
	| { type: "INCREASE_STEP_COUNT" }
	| { type: "CHANGE_IMAGE"; payload: File }
	| { type: "REMOVE_IMAGE" }
	| { type: "CHANGE_TITLE"; payload: State["title"] }
	| { type: "CHANGE_DESCRIPTION"; payload: State["description"] }
	| { type: "CHANGE_IS_PUBLIC"; payload: State["isPublic"] }
	| { type: "MOVE_STEP"; payload: { from: number; to: number } }
	| { type: "SET"; payload: State }
	| { type: "RESET" };

function reducer(st: State, act: Action): State {
	switch (act.type) {
		case "PATCH_INGREDIENT": {
			const existing = st.ingredients[act.payload.index];
			if (existing) {
				return {
					...st,
					ingredients: st.ingredients.map((i, idx) =>
						idx === act.payload.index ? { ...i, ...act.payload.patch } : i,
					),
				};
			}
			return {
				...st,
				ingredients: [...st.ingredients, { id: -st.ingredientCount, ...act.payload.patch }],
			};
		}

		case "WRITE_STEP": {
			const existing = st.steps[act.payload.index];
			if (existing) {
				return {
					...st,
					steps: st.steps.map((s, i) =>
						i === act.payload.index ? { ...s, body: act.payload.body } : s,
					),
				};
			}
			return {
				...st,
				steps: [
					...st.steps,
					{
						id: -st.stepCount,
						body: act.payload.body,
						order: st.steps.length + 1,
					},
				],
			};
		}

		case "MOVE_STEP": {
			const fromStep = st.steps[act.payload.from];
			const toStep = st.steps[act.payload.to];
			if (!fromStep || !toStep) return st;

			const copy = [...st.steps];
			copy[act.payload.from] = toStep;
			copy[act.payload.to] = fromStep;
			return {
				...st,
				steps: copy.map((s, i) => ({ ...s, order: i + 1 })),
			};
		}

		case "INCREASE_INGREDIENT_COUNT":
			return {
				...st,
				ingredientCount: st.ingredientCount + 1,
			};

		case "INCREASE_STEP_COUNT":
			return {
				...st,
				stepCount: st.stepCount + 1,
			};

		case "CHANGE_IMAGE":
			return { ...st, image: act.payload };

		case "REMOVE_IMAGE":
			return { ...st, image: null };

		case "CHANGE_TITLE":
			return { ...st, title: act.payload };

		case "CHANGE_DESCRIPTION":
			return { ...st, description: act.payload };

		case "CHANGE_IS_PUBLIC":
			return { ...st, isPublic: act.payload };

		case "SET":
			return act.payload;

		case "RESET":
			return initialState;

		default:
			return st;
	}
}

export function useCookbookForm(onSuccess?: () => void, onReset?: () => void) {
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

	// Derived: the add button locks until the last row is complete enough.
	// If there are fewer rows than slots, the trailing slot is empty -> locked.
	const lastIngredient = state.ingredients[state.ingredientCount - 1];
	const ingredientAddDisabled =
		state.ingredients.length < state.ingredientCount ||
		!lastIngredient ||
		!isIngredientComplete(lastIngredient);

	const lastStep = state.steps[state.stepCount - 1];
	const stepAddDisabled =
		state.steps.length < state.stepCount || !lastStep || !isStepComplete(lastStep);

	function handleCreate() {
		const completeIngredients = state.ingredients.filter(isIngredientComplete);
		const completeSteps = state.steps.filter(isStepComplete);

		const formData = new FormData();
		formData.set("title", state.title);
		formData.set("description", state.description);
		formData.set("isPublic", Help.toStringBoolean(state.isPublic));
		if (state.image) formData.set("image", state.image);

		for (const [i, { id: _, ...rest }] of completeIngredients.entries()) {
			formData.append(`ingredients[${i}]`, JSON.stringify(rest));
		}

		for (const [i, { id: _, ...rest }] of completeSteps.entries()) {
			formData.append(`steps[${i}]`, JSON.stringify(rest));
		}

		createMut.mutate({ formData });
	}

	function handleUpdate(prev: Entities.Cookbook) {
		const completeIngredients = state.ingredients.filter(isIngredientComplete);
		const completeSteps = state.steps.filter(isStepComplete);

		const formData = new FormData();

		if (state.title !== prev.title) formData.set("title", state.title);
		if (state.description !== prev.description) formData.set("description", state.description);
		if (state.isPublic !== prev.isPublic)
			formData.set("isPublic", Help.toStringBoolean(state.isPublic));
		if (state.image instanceof File) formData.set("image", state.image);

		const currIngredientIds = new Set(completeIngredients.map((i) => i.id));

		const changedIngredients = completeIngredients.filter((i) => {
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

		const newIngredients = [...completeIngredients.filter((i) => i.id < 0), ...changedIngredients];
		for (const [i, { id: _, ...rest }] of newIngredients.entries()) {
			formData.append(`newIngredients[${i}]`, JSON.stringify(rest));
		}

		const currStepIds = new Set(completeSteps.map((s) => s.id));
		const deletedStepIds = prev.steps.filter((s) => !currStepIds.has(s.id)).map((s) => s.id);
		for (const [i, id] of deletedStepIds.entries()) {
			formData.append(`deletedStepIds[${i}]`, id.toString());
		}

		const newSteps = completeSteps.filter((s) => s.id < 0);
		for (const [i, { id: _, ...rest }] of newSteps.entries()) {
			formData.append(`newSteps[${i}]`, JSON.stringify(rest));
		}

		const updatedSteps = completeSteps.filter((s) => {
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

	const handleTitleChange = (p: string) => dispatch({ type: "CHANGE_TITLE", payload: p });

	const handleImageChange = (p: File | null) =>
		dispatch(p ? { type: "CHANGE_IMAGE", payload: p } : { type: "REMOVE_IMAGE" });

	const handleDescriptionChange = (p: string) =>
		dispatch({ type: "CHANGE_DESCRIPTION", payload: p });

	const handleIsPublicChange = (p: boolean) => dispatch({ type: "CHANGE_IS_PUBLIC", payload: p });

	const handleAddIngredient = () => dispatch({ type: "INCREASE_INGREDIENT_COUNT" });

	const handlePatchIngredient = (index: number, patch: IngredientPatch) =>
		dispatch({ type: "PATCH_INGREDIENT", payload: { index, patch } });

	const handleAddStep = () => dispatch({ type: "INCREASE_STEP_COUNT" });

	const handleWriteStep = (index: number, body: string) =>
		dispatch({ type: "WRITE_STEP", payload: { index, body } });

	const handleMoveStep = (from: number, to: number) =>
		dispatch({ type: "MOVE_STEP", payload: { from, to } });

	return {
		...state,
		ingredientAddDisabled,
		stepAddDisabled,
		dispatch,
		handleCreate,
		handleUpdate,
		handleReset,
		handleTitleChange,
		handleImageChange,
		handleDescriptionChange,
		handleIsPublicChange,
		handleAddIngredient,
		handlePatchIngredient,
		handleAddStep,
		handleWriteStep,
		handleMoveStep,
	};
}
