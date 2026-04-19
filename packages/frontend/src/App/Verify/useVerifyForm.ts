import { useMutation } from "@tanstack/react-query";
import { type } from "arktype";
import { useNavigate, useSearchParams } from "react-router";

import { useAppContext } from "@/App/AppContext";
import { useForm } from "@/Hooks/useForm";
import { getErrorMessage } from "@/lib/utils";
import { useLocale } from "@/Locale/useLocale";
import { routes } from "@/router";

export function useVerifyForm() {
	const { authClient } = useAppContext();
	const { t } = useLocale("auth");
	const [searchParams] = useSearchParams();
	const nav = useNavigate();
	const mutation = useMutation(
		authClient.verify({
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
				message: t("auth.login.email.error"),
			}),
			code: "string",
		}),
		onSubmit: ({ values }) => mutation.mutate({ body: values }),
		mutation: mutation,
		defaultValues: {
			email: searchParams.get("email") ?? "",
		},
	});

	return form;
}
