import { useMutation } from "@tanstack/react-query";
import { type } from "arktype";
import { useNavigate } from "react-router";

import { useAppContext } from "@/app/AppContext";
import { useForm } from "@/hooks/useForm";
import { useLocale } from "@/locale/useLocale";
import { routes } from "@/router";

export function useLoginForm() {
	const { authClient } = useAppContext();
	const { txt } = useLocale("auth", {
		emailErr: ["login.email.error"],
		passwordErr: ["login.password.error"],
	});
	const nav = useNavigate();
	const mutation = useMutation(
		authClient.login({
			async onSuccess() {
				await nav(routes.dashboard);
			},
			onError(err) {
				form.setRootError(err);
			},
		}),
	);

	const form = useForm({
		schema: type({
			email: type("string.email").configure({ message: txt.emailErr }),
			password: type("string >= 8").configure({
				message: txt.passwordErr,
			}),
		}),
		onSubmit: ({ values }) => mutation.mutate({ body: values }),
		mutation,
		defaultValues: import.meta.env.DEV ? { email: "ozan@cookbook.app", password: "123456789" } : {},
	});

	return form;
}
