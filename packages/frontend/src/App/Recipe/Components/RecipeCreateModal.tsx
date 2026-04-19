import { useRecipeForm } from "@/App/Recipe/Hooks/useRecipeForm";
import { CardDeck } from "@/Components/CardDeck";
import { Modal } from "@/Components/modals/Modal";
import type { ModalState } from "@/Hooks/useModal";
import { useLocale } from "@/Locale/useLocale";

import { RecipeFormPartOne } from "./RecipeFormPartOne";
import { RecipeFormPartThree } from "./RecipeFormPartThree";
import { RecipeFormPartTwo } from "./RecipeFormPartTwo";

type Props = {
	modal: ModalState;
	form: ReturnType<typeof useRecipeForm>;
};

export function RecipeCreateModal(props: Props) {
	const { txt } = useLocale("app", {
		title: ["createModal.title"],
		description: ["createModal.description"],
	});

	return (
		<Modal
			disableEscapeClose
			{...props.modal}
			title={txt.title}
			description={txt.description}
			className="max-w-lg border-none bg-transparent shadow-none"
		>
			<div className="max-w-lg p-8">
				<CardDeck onFinish={props.form.handleCreate}>
					<RecipeFormPartOne
						image={props.form.image}
						onImageChange={(p) =>
							props.form.dispatch(
								p ? { type: "CHANGE_IMAGE", payload: p } : { type: "REMOVE_IMAGE" },
							)
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
						onCompleteIngredient={(p) =>
							props.form.dispatch({ type: "ADD_INGREDIENT", payload: p })
						}
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
				</CardDeck>
			</div>
		</Modal>
	);
}
