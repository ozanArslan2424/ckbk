import { useEffect } from "react";

import { RecipeFormPartOne } from "@/app/Recipe/Components/RecipeFormPartOne";
import { RecipeFormPartThree } from "@/app/Recipe/Components/RecipeFormPartThree";
import { RecipeFormPartTwo } from "@/app/Recipe/Components/RecipeFormPartTwo";
import { useRecipeForm } from "@/app/Recipe/Hooks/useRecipeForm";
import type { RecipeDetails } from "@/app/Recipe/Types/RecipeDetails";
import { Modal } from "@/components/modals/Modal";
import { useLocale } from "@/hooks/useLocale";
import type { ModalState } from "@/hooks/useModal";
import { Events } from "@/lib/Events";

type Props = {
	modal: ModalState<RecipeDetails>;
};

export function RecipeUpdateModal(props: Props) {
	const form = useRecipeForm(
		() => {
			props.modal.onOpenChange(false);
		},
		() => {
			props.modal.onOpenChange(false);
		},
	);
	const { txt } = useLocale("app", {
		title: ["updateModal.title", { title: props.modal.data?.recipe.title }],
		description: ["updateModal.description"],
		delete: ["updateModal.delete"],
		cancel: ["updateModal.cancel"],
		submit: ["updateModal.submit"],
	});

	useEffect(() => {
		if (props.modal.data) {
			form.dispatch({
				type: "SET",
				payload: {
					ingredients: props.modal.data.ingredients,
					ingredientCount: props.modal.data.ingredients.length,
					ingredientAddDisabled: false,
					steps: props.modal.data.steps,
					stepCount: props.modal.data.steps.length,
					stepAddDisabled: false,
					image: props.modal.data.recipe.image ?? null,
					title: props.modal.data.recipe.title,
					description: props.modal.data.recipe.description,
					isPublic: props.modal.data.recipe.isPublic,
				},
			});
		}
		// oxlint-disable-next-line eslint-plugin-react-hooks/exhaustive-deps
	}, [props.modal.data]);

	const onSubmitFactory = Events.click<[RecipeDetails]>((e, recipe) => {
		e.preventDefault();
		form.handleUpdate(recipe);
	});

	if (!props.modal.data) return null;

	const handleSubmit = onSubmitFactory(props.modal.data);

	return (
		<Modal
			{...props.modal}
			title={txt.title}
			description={txt.description}
			className="w-max border-none bg-transparent p-4"
		>
			<div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
				<RecipeFormPartOne
					image={form.image}
					onImageChange={(p) =>
						form.dispatch(p ? { type: "CHANGE_IMAGE", payload: p } : { type: "REMOVE_IMAGE" })
					}
					title={form.title}
					onTitleChange={(p) => form.dispatch({ type: "CHANGE_TITLE", payload: p })}
					description={form.description}
					onDescriptionChange={(p) => form.dispatch({ type: "CHANGE_DESCRIPTION", payload: p })}
					isPublic={form.isPublic}
					onIsPublicChange={(p) => form.dispatch({ type: "CHANGE_IS_PUBLIC", payload: p })}
				/>
				<RecipeFormPartTwo
					addDisabled={form.ingredientAddDisabled}
					ingredients={form.ingredients}
					ingredientCount={form.ingredientCount}
					onAddIngredient={() => form.dispatch({ type: "INCREASE_INGREDIENT_COUNT" })}
					onCompleteIngredient={(p) => form.dispatch({ type: "ADD_INGREDIENT", payload: p })}
				/>
				<RecipeFormPartThree
					addDisabled={form.stepAddDisabled}
					steps={form.steps}
					stepCount={form.stepCount}
					onAddStep={() => form.dispatch({ type: "INCREASE_STEP_COUNT" })}
					onWriteStep={(index, body) =>
						form.dispatch({ type: "WRITE_STEP", payload: { index, body } })
					}
					onMoveStep={(from, to) => form.dispatch({ type: "MOVE_STEP", payload: { from, to } })}
				/>
			</div>

			<div className="bg-background flex w-full items-center justify-between gap-4 rounded-md p-4">
				<button type="button" className="outlined hover:bg-rose-400/10 hover:text-rose-500">
					{txt.delete}
				</button>

				<div className="flex items-center gap-4">
					<button type="reset" className="ghost" onClick={form.handleReset}>
						{txt.cancel}
					</button>

					<button type="submit" onClick={handleSubmit}>
						{txt.submit}
					</button>
				</div>
			</div>
		</Modal>
	);
}
