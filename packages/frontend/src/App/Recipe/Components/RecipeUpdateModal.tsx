import { useEffect } from "react";

import { RecipeFormPartOne } from "@/App/Recipe/Components/RecipeFormPartOne";
import { RecipeFormPartThree } from "@/App/Recipe/Components/RecipeFormPartThree";
import { RecipeFormPartTwo } from "@/App/Recipe/Components/RecipeFormPartTwo";
import { Dialog } from "@/Components/modals/dialog";
import { useCookbookForm } from "@/Forms/useRecipeForm";
import type { ModalState } from "@/Hooks/useModal";
import { Events } from "@/lib/events";
import type { RecipeDetails } from "@/Types/RecipeDetails";

type Props = {
	modal: ModalState<RecipeDetails>;
};

export function RecipeUpdateModal({ modal }: Props) {
	const form = useCookbookForm(() => {
		modal.onOpenChange(false);
	});

	useEffect(() => {
		if (modal.data) {
			form.dispatch({
				type: "SET",
				payload: {
					ingredients: modal.data.ingredients,
					ingredientCount: modal.data.ingredients.length,
					ingredientAddDisabled: false,
					steps: modal.data.steps,
					stepCount: modal.data.steps.length,
					stepAddDisabled: false,
					image: modal.data.recipe.image ?? null,
					title: modal.data.recipe.title,
					description: modal.data.recipe.description,
					isPublic: modal.data.recipe.isPublic,
				},
			});
		}
	}, [modal.data]);

	const handleReset = Events.click((e) => {
		e.preventDefault();
		modal.onOpenChange(false);
		form.dispatch({ type: "RESET" });
	});

	return (
		<Dialog
			{...modal}
			title={`Update ${form.title}`}
			description="Fill in the form to update the recipe"
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
					nextDisabled={form.title.length <= 0}
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
				<button className="outlined hover:bg-rose-400/10 hover:text-rose-500">Delete</button>

				<div className="flex items-center gap-4">
					<button type="reset" className="ghost" onClick={handleReset()}>
						Cancel
					</button>

					<button type="submit" onClick={form.handleUpdate}>
						Save Changes
					</button>
				</div>
			</div>
		</Dialog>
	);
}
