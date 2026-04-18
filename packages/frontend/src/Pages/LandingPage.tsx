import { useQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { Link } from "react-router";

import { FormField } from "@/Components/form/FormField";
import { PageContent } from "@/Components/layout/PageContent";
import { useAppContext } from "@/Context/AppContext";
import { useRegisterForm } from "@/Forms/useRegisterForm";
import { CONFIG } from "@/lib/config";
import { routes } from "@/router";

export function LandingPage() {
	const { authClient } = useAppContext();
	const meQuery = useQuery(authClient.queryMe({}));
	const registerForm = useRegisterForm();

	return (
		<PageContent className="flex flex-1 items-center justify-center">
			<div className="flex w-full max-w-sm flex-col gap-8">
				<div className="flex flex-col gap-1">
					<h1 className="text-4xl font-black">🍳 {CONFIG.appTitle.toLocaleUpperCase()}</h1>
					<p className="text-muted-foreground">Your personal recipe box.</p>
				</div>

				{meQuery.data ? (
					<div className="flex flex-col gap-3">
						<p className="text-muted-foreground text-sm">
							Welcome back, <span className="text-foreground font-medium">{meQuery.data.name}</span>
						</p>
						<Link to={routes.dashboard} className="button lg w-full">
							Go to my recipes
						</Link>
					</div>
				) : (
					<form {...registerForm.methods}>
						<div className="flex flex-col gap-3">
							<FormField form={registerForm} name="name" id="name">
								<input
									className="w-full"
									autoComplete="name"
									type="text"
									placeholder="Your name"
									required
								/>
							</FormField>

							<FormField form={registerForm} name="email" id="email">
								<input
									className="w-full"
									autoComplete="email"
									type="email"
									placeholder="Email address"
									required
								/>
							</FormField>

							<FormField form={registerForm} name="password" id="password">
								<input
									className="w-full"
									autoComplete="new-password"
									type="password"
									placeholder="Password"
									required
								/>
							</FormField>

							<button type="submit" className="mt-1 w-full">
								{registerForm.isPending ? (
									<LoaderIcon className="animate-spin" />
								) : (
									"Create account"
								)}
							</button>

							<p className="text-muted-foreground text-center text-xs">
								Already have an account?{" "}
								<Link
									to={routes.login}
									className="text-foreground underline-offset-2 hover:underline"
								>
									Sign in
								</Link>
							</p>
						</div>
					</form>
				)}
			</div>
		</PageContent>
	);
}
