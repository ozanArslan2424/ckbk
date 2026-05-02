import { useMutation } from "@tanstack/react-query";
import { type } from "arktype";
import { useNavigate } from "react-router";

import { useAppContext } from "@/app/AppContext";
import { useForm } from "@/hooks/useForm";
import { useLocale } from "@/locale/useLocale";
import { routes } from "@/router";

export function useCreateProfileForm() {
	const { profileClient } = useAppContext();
	const { txt, language } = useLocale("auth", {
		nameErr: ["createProfile.name.error"],
	});
	const nav = useNavigate();
	const mutation = useMutation(
		profileClient.create(
			{},
			{
				async onSuccess() {
					await nav(routes.dashboard);
				},
				onError(err) {
					form.setRootError(err);
				},
			},
		),
	);

	const form = useForm({
		schema: type({
			name: type("string >= 1").configure({ message: txt.nameErr }),
			language: "'tr'|'en'",
		}),
		onSubmit: ({ values }) => mutation.mutate({ body: values }),
		mutation,
		defaultValues: {
			language: language as "tr" | "en",
		},
	});

	return form;
}
