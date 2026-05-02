import { useEffect } from "react";

import { useCookbookForm } from "@/app/Cookbook/useCookbookForm";
import { RecipeFormPartOne } from "@/app/Recipe/Components/RecipeFormPartOne";
import { RecipeFormPartThree } from "@/app/Recipe/Components/RecipeFormPartThree";
import { RecipeFormPartTwo } from "@/app/Recipe/Components/RecipeFormPartTwo";
import { Modal } from "@/components/modals/Modal";
import type { ModalState } from "@/hooks/useModal";
import type { Entities } from "@/lib/CorpusApi";
import { Events } from "@/lib/Events";
import { useLocale } from "@/locale/useLocale";

type Props = {
	modal: ModalState<Entities.Cookbook>;
};

export function RecipeUpdateModal(props: Props) {
	const form = useCookbookForm(
		() => {
			props.modal.onOpenChange(false);
		},
		() => {
			props.modal.onOpenChange(false);
		},
	);
	const { txt } = useLocale("app", {
		title: ["updateModal.title", { title: props.modal.data?.title }],
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
					steps: props.modal.data.steps,
					stepCount: props.modal.data.steps.length,
					image: props.modal.data.image ?? null,
					title: props.modal.data.title,
					description: props.modal.data.description,
					isPublic: props.modal.data.isPublic,
				},
			});
		}
		// oxlint-disable-next-line eslint-plugin-react-hooks/exhaustive-deps
	}, [props.modal.data]);

	const onSubmitFactory = Events.click<[Entities.Cookbook]>((e, entry) => {
		e.preventDefault();
		form.handleUpdate(entry);
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
				<RecipeFormPartOne form={form} />
				<RecipeFormPartTwo form={form} />
				<RecipeFormPartThree form={form} />
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
