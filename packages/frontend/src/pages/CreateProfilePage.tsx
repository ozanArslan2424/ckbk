import { LoaderIcon } from "lucide-react";

import { useCreateProfileForm } from "@/app/Profile/useCreateProfileForm";
import { FormField } from "@/components/form/FormField";
import { FormRootError } from "@/components/form/FormRootError";
import { RadioGrid } from "@/components/form/RadioGrid";
import { LOCALE_OPTIONS } from "@/locale/Locale";
import { useLocale } from "@/locale/useLocale";

export function CreateProfilePage() {
	const { t, txt } = useLocale("auth", {
		nameLabel: ["createProfile.name.label"],
		languageLabel: ["createProfile.language.label"],
		languageSublabel: ["createProfile.language.sublabel"],
		submitLabel: ["createProfile.submit"],
	});
	const form = useCreateProfileForm();

	const fields = form.createFields([
		{
			name: "name",
			label: txt.nameLabel,
			children: <input autoComplete="name" type="text" required />,
		},
		{
			name: "language",
			label: txt.languageLabel,
			sublabel: txt.languageSublabel,
			children: (
				<RadioGrid
					options={LOCALE_OPTIONS.map((l) => ({
						value: l,
						label: t(`createProfile.language.options.${l}`),
					}))}
				/>
			),
		},
	]);

	return (
		<form className="flex flex-col gap-4" {...form.methods}>
			<FormRootError form={form} />

			{fields.map((field) => (
				<FormField key={field.name} {...field} />
			))}

			<button type="submit" className="w-full" disabled={form.isPending}>
				{form.isPending ? <LoaderIcon className="animate-spin" /> : txt.submitLabel}
			</button>
		</form>
	);
}
