import { LoaderIcon } from "lucide-react";
import { Link } from "react-router";

import { useRegisterForm } from "@/app/Auth/useRegisterForm";
import { FormField } from "@/components/form/FormField";
import { FormRootError } from "@/components/form/FormRootError";
import { RadioGrid } from "@/components/form/RadioGrid";
import { useLocale } from "@/hooks/useLocale";
import { routes } from "@/router";

export function RegisterPage() {
	const { t, txt } = useLocale("auth", {
		title: ["register.title"],
		emailLabel: ["register.email.label"],
		nameLabel: ["register.name.label"],
		passwordLabel: ["register.password.label"],
		languageLabel: ["register.language.label"],
		submitLabel: ["register.submit"],
		backToLoginLabel: ["register.haveAccount"],
	});
	const form = useRegisterForm();

	const fields = form.createFields([
		{
			name: "name",
			label: txt.nameLabel,
			children: <input autoComplete="name" type="text" required />,
		},
		{
			name: "email",
			label: txt.emailLabel,
			children: <input autoComplete="email" type="email" required />,
		},
		{
			name: "password",
			label: txt.passwordLabel,
			children: <input autoComplete="new-password" type="password" required />,
		},
		{
			name: "language",
			label: txt.languageLabel,
			children: (
				<RadioGrid
					onChange={form.handleLanguageChange}
					options={(["tr", "en"] as const).map((l) => ({
						value: l,
						label: t(`register.language.options.${l}`),
					}))}
				/>
			),
		},
	]);

	return (
		<>
			<form className="flex flex-col gap-4" {...form.methods}>
				<FormRootError form={form} />

				{fields.map((field) => (
					<FormField key={field.name} {...field} />
				))}

				<button type="submit" className="w-full" disabled={form.isPending}>
					{form.isPending ? <LoaderIcon className="animate-spin" /> : txt.submitLabel}
				</button>
			</form>

			<footer className="space-y-1">
				<Link
					to={routes.login}
					className="text-foreground/70 hover:text-foreground block text-center text-sm transition-all"
				>
					{txt.backToLoginLabel}
				</Link>
			</footer>
		</>
	);
}
