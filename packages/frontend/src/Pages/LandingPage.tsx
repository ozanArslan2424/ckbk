import { useQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { Link } from "react-router";

import { FormField } from "@/Components/form/FormField";
import { FormRootError } from "@/Components/form/FormRootError";
import { PageContent } from "@/Components/layout/PageContent";
import { useAppContext } from "@/Context/AppContext";
import { useRegisterForm } from "@/Forms/useRegisterForm";
import { CONFIG } from "@/lib/CONFIG";
import { useLocale } from "@/Locale/useLocale";
import { routes } from "@/router";

export function LandingPage() {
	const { t: tLanding } = useLocale("landing");
	const { t: tAuth } = useLocale("auth");
	const { authClient } = useAppContext();
	const meQuery = useQuery(authClient.queryMe({}));
	const form = useRegisterForm();

	const txt = {
		subtitle: tLanding("subtitle"),
		welcomeBack: tLanding("welcomeBack"),
		explore: tLanding("explore"),
	};

	const txtReg = {
		title: tAuth("register.title"),
		emailLabel: tAuth("register.email.label"),
		nameLabel: tAuth("register.name.label"),
		passwordLabel: tAuth("register.password.label"),
		submitLabel: tAuth("register.submit"),
		backToLoginLabel: tAuth("register.haveAccount"),
	};

	const fields = form.createFields([
		{
			name: "name",
			children: <input autoComplete="name" type="text" placeholder={txtReg.nameLabel} required />,
		},
		{
			name: "email",
			children: (
				<input autoComplete="email" type="email" placeholder={txtReg.emailLabel} required />
			),
		},
		{
			name: "password",
			children: (
				<input
					autoComplete="new-password"
					type="password"
					placeholder={txtReg.passwordLabel}
					required
				/>
			),
		},
	]);

	return (
		<PageContent className="flex flex-1 items-center justify-center">
			<div className="flex w-full max-w-sm flex-col gap-8">
				<div className="flex flex-col gap-1">
					<h1 className="text-4xl font-black">🍳 {CONFIG.appTitle.toLocaleUpperCase()}</h1>
					<p className="text-muted-foreground">{txt.subtitle}</p>
				</div>

				{meQuery.data ? (
					<div className="flex flex-col gap-3">
						<p className="text-muted-foreground text-sm">
							{txt.welcomeBack}{" "}
							<span className="text-foreground font-medium">{meQuery.data.name}</span>
						</p>
						<Link to={routes.dashboard} className="button lg w-full">
							{txt.explore}
						</Link>
					</div>
				) : (
					<form {...form.methods}>
						<div className="flex flex-col gap-3">
							<FormRootError form={form} />

							{fields.map((field) => (
								<FormField key={field.name} {...field} />
							))}

							<button type="submit" className="mt-1 w-full">
								{form.isPending ? <LoaderIcon className="animate-spin" /> : txtReg.submitLabel}
							</button>

							<Link
								to={routes.login}
								className="text-muted-foreground text-center text-xs underline-offset-2 hover:underline"
							>
								{txtReg.backToLoginLabel}
							</Link>
						</div>
					</form>
				)}
			</div>
		</PageContent>
	);
}
