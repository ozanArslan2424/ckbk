import { LoaderIcon } from "lucide-react";
import { Link } from "react-router";

import { useVerifyForm } from "@/app/Auth/useVerifyForm";
import { FormField } from "@/components/form/FormField";
import { FormRootError } from "@/components/form/FormRootError";
import { useLocale } from "@/hooks/useLocale";
import { routes } from "@/router";

export function VerifyPage() {
	const { txt } = useLocale("auth", {
		title: ["verify.title"],
		emailLabel: ["verify.email.label"],
		codeLabel: ["verify.code.label"],
		submitLabel: ["verify.submit"],
		backToLoginLabel: ["verify.haveAccount"],
	});
	const form = useVerifyForm();

	const fields = form.createFields([
		{
			name: "email",
			children: <input autoComplete="email" type="email" placeholder={txt.emailLabel} required />,
		},
		{
			name: "code",
			children: <input type="text" placeholder={txt.codeLabel} required />,
		},
	]);

	return (
		<>
			<header className="flex flex-col items-center gap-1">
				<h1 className="text-2xl font-bold">{txt.title}</h1>
			</header>

			<form className="flex flex-col gap-6" {...form.methods}>
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
