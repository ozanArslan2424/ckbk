import { LoaderIcon } from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";

import { FormField } from "@/Components/form/FormField";
import { FormRootError } from "@/Components/form/FormRootError";
import { useLoginForm } from "@/Forms/useLoginForm";
import { useLocale } from "@/lib/Locale/useLocale";
import { routes } from "@/router";

export function LoginPage() {
	const { t } = useLocale("auth");
	const form = useLoginForm();

	const title = t("login.title");
	const emailLabel = t("login.email.label");
	const passwordLabel = t("login.password.label");
	const forgotPasswordLabel = t("login.forgotPassword");
	const submitLabel = t("login.submit");
	const registerLabel = t("login.noAccount");

	const fields = form.createFields([
		{
			name: "email",
			id: "email",
			children: <input autoComplete="email" type="email" placeholder={emailLabel} required />,
		},
		{
			name: "password",
			id: "password",
			children: (
				<input
					autoComplete="current-password"
					type="password"
					placeholder={passwordLabel}
					required
				/>
			),
		},
	]);

	return (
		<>
			<header className="flex flex-col items-center gap-1">
				<h1 className="text-2xl font-bold">{title}</h1>
			</header>

			<form className="flex flex-col gap-4 py-4" {...form.methods}>
				<FormRootError form={form} />

				{fields.map((field) => (
					<FormField key={field.name} {...field} />
				))}

				<button type="submit" className="lg w-full" disabled={form.isPending}>
					{form.isPending ? <LoaderIcon className="animate-spin" /> : submitLabel}
				</button>
			</form>

			<footer className="space-y-1">
				<button
					// to={clientRoutes.forgotPassword}
					onClick={() => toast("bro got b12 deficiency frfr no cap")}
					className="unset text-foreground/70 hover:text-foreground block w-full text-center text-sm transition-all"
				>
					{forgotPasswordLabel}
				</button>

				<Link
					to={routes.register}
					className="text-foreground/70 hover:text-foreground block text-center text-sm transition-all"
				>
					{registerLabel}
				</Link>
			</footer>
		</>
	);
}
