import { useCookbookForm } from "@/app/Cookbook/useCookbookForm";
import { CardDeck } from "@/components/cards/CardDeck";
import { Modal } from "@/components/modals/Modal";
import type { ModalState } from "@/hooks/useModal";
import { useLocale } from "@/locale/useLocale";

import { RecipeFormPartOne } from "./RecipeFormPartOne";
import { RecipeFormPartThree } from "./RecipeFormPartThree";
import { RecipeFormPartTwo } from "./RecipeFormPartTwo";

type Props = {
	modal: ModalState;
};

export function RecipeCreateModal(props: Props) {
	const form = useCookbookForm(() => {
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
					<RecipeFormPartOne form={form} />
					<RecipeFormPartTwo form={form} />
					<RecipeFormPartThree form={form} />
				</CardDeck>
			</div>
		</Modal>
	);
}
