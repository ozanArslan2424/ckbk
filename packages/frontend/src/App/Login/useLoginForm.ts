import { useMutation } from "@tanstack/react-query";
import { type } from "arktype";
import { useNavigate } from "react-router";

import { useAppContext } from "@/App/AppContext";
import { useForm } from "@/Hooks/useForm";
import { getErrorMessage } from "@/lib/utils";
import { useLocale } from "@/Locale/useLocale";
import { routes } from "@/router";

export function useLoginForm() {
	const { authClient } = useAppContext();
	const { t } = useLocale("auth");
	const nav = useNavigate();
	const mutation = useMutation(
		authClient.login({
			async onSuccess() {
				await nav(routes.dashboard);
			},
			onError(err) {
				form.setRootError(getErrorMessage(err));
			},
		}),
	);

	const form = useForm({
		schema: type({
			email: type("string.email").configure({
				message: t("login.email.error"),
			}),
			password: type("string >= 8").configure({
				message: t("login.password.error"),
			}),
		}),
		onSubmit: ({ values }) => mutation.mutate({ body: values }),
		mutation,
		defaultValues: import.meta.env.DEV
			? {
					email: "ozan@cookbook.app",
					password: "123456789",
				}
			: {},
	});

	return form;
}
