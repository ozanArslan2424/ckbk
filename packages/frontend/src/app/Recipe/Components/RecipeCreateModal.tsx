import { useCookBookForm } from "@/app/Cookbook/useCookbookForm";
import { CardDeck } from "@/components/cards/CardDeck";
import { Modal } from "@/components/modals/Modal";
import { useLocale } from "@/hooks/useLocale";
import type { ModalState } from "@/hooks/useModal";

import { RecipeFormPartOne } from "./RecipeFormPartOne";
import { RecipeFormPartThree } from "./RecipeFormPartThree";
import { RecipeFormPartTwo } from "./RecipeFormPartTwo";

type Props = {
	modal: ModalState;
};

export function RecipeCreateModal(props: Props) {
	const form = useCookBookForm(() => {
		props.modal.onOpenChange(false);
	});
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
				<CardDeck onFinish={form.handleCreate}>
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
				</CardDeck>
			</div>
		</Modal>
	);
}
