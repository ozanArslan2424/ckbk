import { LoaderIcon } from "lucide-react";
import { Link } from "react-router";

import { FormField } from "@/Components/form/FormField";
import { FormRootError } from "@/Components/form/FormRootError";
import { useVerifyForm } from "@/Forms/useVerifyForm";
import { useLocale } from "@/lib/Locale/useLocale";
import { routes } from "@/router";

export function VerifyPage() {
	const { t } = useLocale("auth");
	const form = useVerifyForm();

	const title = t("verify.title");
	const emailLabel = t("verify.email.label");
	const codeLabel = t("verify.code.label");
	const submitLabel = t("verify.submit");
	const backToLoginLabel = t("verify.haveAccount");

	const fields = form.createFields([
		{
			name: "email",
			children: <input autoComplete="email" type="email" placeholder={emailLabel} required />,
		},
		{
			name: "code",
			children: <input type="text" placeholder={codeLabel} required />,
		},
	]);

	return (
		<>
			<header className="flex flex-col items-center gap-1">
				<h1 className="text-2xl font-bold">{title}</h1>
			</header>

			<form className="flex flex-col gap-6" {...form.methods}>
				<FormRootError form={form} />

				{fields.map((field) => (
					<FormField key={field.name} {...field} />
				))}

				<button type="submit" className="lg w-full" disabled={form.isPending}>
					{form.isPending ? <LoaderIcon className="animate-spin" /> : submitLabel}
				</button>
			</form>

			<footer className="space-y-1">
				<Link
					to={routes.login}
					className="text-foreground/70 hover:text-foreground block text-center text-sm transition-all"
				>
					{backToLoginLabel}
				</Link>
			</footer>
		</>
	);
}
