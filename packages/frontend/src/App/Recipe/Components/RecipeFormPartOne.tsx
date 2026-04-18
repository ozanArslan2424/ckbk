import { useCardDeckContext } from "@/Components/CardDeck";
import { Checkbox } from "@/Components/form/Checkbox";
import { FormCard } from "@/Components/form/FormCard";
import { FormFieldPlain } from "@/Components/form/FormFieldPlain";
import { ImageUpload } from "@/Components/form/ImageUpload";

type RecipeFormProps = {
	image: File | string | null;
	onImageChange: (file: File | null) => void;
	title: string;
	onTitleChange: (v: string) => void;
	description: string;
	onDescriptionChange: (v: string) => void;
	isPublic: boolean;
	onIsPublicChange: (v: boolean) => void;
	nextDisabled: boolean;
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
	nextDisabled,
}: RecipeFormProps) {
	const ctx = useCardDeckContext();

	return (
		<FormCard
			title="Recipe Details"
			footer={
				ctx ? (
					<button disabled={nextDisabled} onClick={ctx.onNext} className="secondary w-max">
						Next
					</button>
				) : null
			}
		>
			<FormFieldPlain name="image" label="Cover Image">
				<ImageUpload image={image} onImageChange={onImageChange} />
			</FormFieldPlain>
			<FormFieldPlain name="title" label="Recipe Title">
				<input
					placeholder="e.g. Grandma's Apple Pie"
					onChange={(e) => onTitleChange(e.target.value)}
					value={title}
				/>
			</FormFieldPlain>
			<FormFieldPlain name="description" label="Description">
				<textarea
					placeholder="A brief story or notes about this recipe..."
					className="min-h-25 resize-y"
					onChange={(e) => onDescriptionChange(e.target.value)}
					value={description}
				/>
			</FormFieldPlain>
			<FormFieldPlain name="isPublic" label="Make this recipe public" labelPlacement="right">
				<Checkbox onChange={onIsPublicChange} value={isPublic} />
			</FormFieldPlain>
		</FormCard>
	);
}
