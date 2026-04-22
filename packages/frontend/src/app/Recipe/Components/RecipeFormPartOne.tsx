import { useCardDeckContext } from "@/components/cards/CardDeck";
import { Checkbox } from "@/components/form/Checkbox";
import { FormCard } from "@/components/form/FormCard";
import { FormFieldPlain } from "@/components/form/FormFieldPlain";
import { ImageUpload } from "@/components/form/ImageUpload";
import { useCommonLocale } from "@/hooks/useCommonLocale";
import { useLocale } from "@/hooks/useLocale";

type RecipeFormProps = {
	image: File | string | null;
	onImageChange: (file: File | null) => void;
	title: string;
	onTitleChange: (v: string) => void;
	description: string;
	onDescriptionChange: (v: string) => void;
	isPublic: boolean;
	onIsPublicChange: (v: boolean) => void;
};

export function RecipeFormPartOne({
	image,
	onImageChange,
	title,
	onTitleChange,
	description,
	onDescriptionChange,
	isPublic,
	onIsPublicChange,
}: RecipeFormProps) {
	const { txt: txtCommon } = useCommonLocale();
	const { txt } = useLocale("app", {
		recipeDetails: ["form.details"],
		recipeImageLabel: ["form.image.label"],
		recipeTitleLabel: ["form.title.label"],
		recipeTitleSublabel: ["form.title.sublabel"],
		recipeTitlePlaceholder: ["form.title.placeholder"],
		recipeDescriptionLabel: ["form.description.label"],
		recipeDescriptionPlaceholer: ["form.description.placeholder"],
		recipePublicLabel: ["form.isPublic.label"],
	});
	const ctx = useCardDeckContext();

	return (
		<FormCard
			title={txt.recipeDetails}
			footer={
				ctx ? (
					<button type="button" disabled={title.length <= 5} onClick={ctx.onNext} className="w-max">
						{txtCommon.next}
					</button>
				) : null
			}
		>
			<FormFieldPlain name="image" label={txt.recipeImageLabel}>
				<ImageUpload image={image} onImageChange={onImageChange} />
			</FormFieldPlain>
			<FormFieldPlain name="title" label={txt.recipeTitleLabel} sublabel={txt.recipeTitleSublabel}>
				<input
					placeholder={txt.recipeTitlePlaceholder}
					onChange={(e) => onTitleChange(e.target.value)}
					value={title}
				/>
			</FormFieldPlain>
			<FormFieldPlain name="description" label={txt.recipeDescriptionLabel}>
				<textarea
					placeholder={txt.recipeDescriptionPlaceholer}
					className="min-h-25 resize-y"
					onChange={(e) => onDescriptionChange(e.target.value)}
					value={description}
				/>
			</FormFieldPlain>
			<FormFieldPlain name="isPublic" label={txt.recipePublicLabel} labelPlacement="right">
				<Checkbox onChange={onIsPublicChange} value={isPublic} />
			</FormFieldPlain>
		</FormCard>
	);
}
