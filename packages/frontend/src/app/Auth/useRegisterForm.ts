import { useMutation } from "@tanstack/react-query";
import { type } from "arktype";
import { useNavigate } from "react-router";

import { useAppContext } from "@/app/AppContext";
import { useForm } from "@/hooks/useForm";
import { useLocale } from "@/hooks/useLocale";
import { getErrorMessage } from "@/lib/utils";
import { routes } from "@/router";

export function useRegisterForm() {
	const { authClient } = useAppContext();
	const { t } = useLocale("auth");
	const nav = useNavigate();
	const mutation = useMutation(
		authClient.register({
			async onSuccess(res) {
				await nav(`${routes.verify}?email=${res.email}`);
			},
			onError(err) {
				form.setRootError(getErrorMessage(err));
			},
		}),
	);

	const form = useForm({
		schema: type({
			name: type("string >= 1").configure({
				message: t("register.name.error"),
			}),
			email: type("string.email").configure({
				message: t("register.email.error"),
			}),
			password: type("string >= 8").configure({
				message: t("register.password.error"),
			}),
		}),
		onSubmit: ({ values }) => mutation.mutate({ body: values }),
		mutation,
	});

	return form;
}
