import { LoaderIcon } from "lucide-react";
import { Link } from "react-router";

import { FormField } from "@/Components/form/FormField";
import { FormRootError } from "@/Components/form/FormRootError";
import { useRegisterForm } from "@/Forms/useRegisterForm";
import { useLocale } from "@/Locale/useLocale";
import { routes } from "@/router";

export function RegisterPage() {
	const { t } = useLocale("auth");
	const form = useRegisterForm();

	const txt = {
		title: t("register.title"),
		emailLabel: t("register.email.label"),
		nameLabel: t("register.name.label"),
		passwordLabel: t("register.password.label"),
		submitLabel: t("register.submit"),
		backToLoginLabel: t("register.haveAccount"),
	};

	const fields = form.createFields([
		{
			name: "name",
			children: <input autoComplete="name" type="text" placeholder={txt.nameLabel} required />,
		},
		{
			name: "email",
			children: <input autoComplete="email" type="email" placeholder={txt.emailLabel} required />,
		},
		{
			name: "password",
			children: (
				<input
					autoComplete="new-password"
					type="password"
					placeholder={txt.passwordLabel}
					required
				/>
			),
		},
	]);

	return (
		<>
			<header className="flex flex-col items-center gap-1">
				<h1 className="text-2xl font-bold">{txt.title}</h1>
			</header>

			<form className="flex flex-col gap-4 py-4" {...form.methods}>
				<FormRootError form={form} />

				{fields.map((field) => (
					<FormField key={field.name} {...field} />
				))}

				<button type="submit" className="lg w-full" disabled={form.isPending}>
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
