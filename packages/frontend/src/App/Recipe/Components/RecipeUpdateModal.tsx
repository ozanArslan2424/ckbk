import { useEffect } from "react";

import { RecipeFormPartOne } from "@/App/Recipe/Components/RecipeFormPartOne";
import { RecipeFormPartThree } from "@/App/Recipe/Components/RecipeFormPartThree";
import { RecipeFormPartTwo } from "@/App/Recipe/Components/RecipeFormPartTwo";
import type { useRecipeForm } from "@/App/Recipe/Hooks/useRecipeForm";
import { Modal } from "@/Components/modals/Modal";
import type { ModalState } from "@/Hooks/useModal";
import { Events } from "@/lib/events";
import { useLocale } from "@/Locale/useLocale";
import type { RecipeDetails } from "@/Types/RecipeDetails";

type Props = {
	modal: ModalState<RecipeDetails>;
	form: ReturnType<typeof useRecipeForm>;
};

export function RecipeUpdateModal(props: Props) {
	const { txt } = useLocale("app", {
		title: ["updateModal.title", { title: props.modal.data?.recipe.title }],
		description: ["updateModal.description"],
		delete: ["updateModal.delete"],
		cancel: ["updateModal.cancel"],
		submit: ["updateModal.submit"],
	});

	useEffect(() => {
		if (props.modal.data) {
			props.form.dispatch({
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
	}, [props.modal.data]);

	const handleReset = Events.click((e) => {
		e.preventDefault();
		props.modal.onOpenChange(false);
		props.form.dispatch({ type: "RESET" });
	});

	return (
		<Modal
			{...props.modal}
			title={txt.title}
			description={txt.description}
			className="w-max border-none bg-transparent p-4"
		>
			<div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
				<RecipeFormPartOne
					image={props.form.image}
					onImageChange={(p) =>
						props.form.dispatch(p ? { type: "CHANGE_IMAGE", payload: p } : { type: "REMOVE_IMAGE" })
					}
					title={props.form.title}
					onTitleChange={(p) => props.form.dispatch({ type: "CHANGE_TITLE", payload: p })}
					description={props.form.description}
					onDescriptionChange={(p) =>
						props.form.dispatch({ type: "CHANGE_DESCRIPTION", payload: p })
					}
					isPublic={props.form.isPublic}
					onIsPublicChange={(p) => props.form.dispatch({ type: "CHANGE_IS_PUBLIC", payload: p })}
				/>
				<RecipeFormPartTwo
					addDisabled={props.form.ingredientAddDisabled}
					ingredients={props.form.ingredients}
					ingredientCount={props.form.ingredientCount}
					onAddIngredient={() => props.form.dispatch({ type: "INCREASE_INGREDIENT_COUNT" })}
					onCompleteIngredient={(p) => props.form.dispatch({ type: "ADD_INGREDIENT", payload: p })}
				/>
				<RecipeFormPartThree
					addDisabled={props.form.stepAddDisabled}
					steps={props.form.steps}
					stepCount={props.form.stepCount}
					onAddStep={() => props.form.dispatch({ type: "INCREASE_STEP_COUNT" })}
					onWriteStep={(index, body) =>
						props.form.dispatch({ type: "WRITE_STEP", payload: { index, body } })
					}
					onMoveStep={(from, to) =>
						props.form.dispatch({ type: "MOVE_STEP", payload: { from, to } })
					}
				/>
			</div>

			<div className="bg-background flex w-full items-center justify-between gap-4 rounded-md p-4">
				<button className="outlined hover:bg-rose-400/10 hover:text-rose-500">{txt.delete}</button>

				<div className="flex items-center gap-4">
					<button type="reset" className="ghost" onClick={handleReset()}>
						{txt.cancel}
					</button>

					<button type="submit" onClick={props.form.handleUpdate}>
						{txt.submit}
					</button>
				</div>
			</div>
		</Modal>
	);
}
