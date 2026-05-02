import { useMutation } from "@tanstack/react-query";
import { type } from "arktype";
import { useNavigate } from "react-router";

import { useAppContext } from "@/app/AppContext";
import { useForm } from "@/hooks/useForm";
import { useLocale } from "@/locale/useLocale";
import { routes } from "@/router";

export function useRegisterForm() {
	const { authClient } = useAppContext();
	const { txt } = useLocale("auth", {
		emailErr: ["register.email.error"],
		passwordErr: ["register.password.error"],
	});
	const nav = useNavigate();
	const mutation = useMutation(
		authClient.register({
			async onSuccess(res) {
				await nav(`${routes.verify}?email=${res.email}`);
			},
			onError(err) {
				form.setRootError(err);
			},
		}),
	);

	const form = useForm({
		schema: type({
			email: type("string.email").configure({ message: txt.emailErr }),
			password: type("string >= 8").configure({ message: txt.passwordErr }),
		}),
		onSubmit: ({ values }) => mutation.mutate({ body: values }),
		mutation,
	});

	return { ...form };
}
