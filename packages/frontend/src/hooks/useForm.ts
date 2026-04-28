import type { UseMutationResult } from "@tanstack/react-query";
import { useCallback, useMemo, useRef, useState, useTransition } from "react";

import type { FormFieldProps } from "@/components/form/FormField";
import type { Help } from "@/lib/Help";
import { Schema } from "@/lib/Schema";

type TFormErrors<T> = Record<keyof T | "_root", string[] | undefined>;

type SubmitData<T> = {
	values: T;
	formData: FormData;
	defaultValues?: Partial<T>;
};

type UseFormArgs<T> = {
	schema: Schema.Schema<T>;
	onSubmit: (submitData: SubmitData<T>) => Help.MaybePromise<void>;
	onReset?: () => void;
	defaultValues?: Partial<T>;
	mutation?: UseMutationResult<any, any, any, any>;
	noValidate?: boolean;
};

type FormMethods = {
	onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
	onReset: () => void;
	ref: React.RefObject<HTMLFormElement | null>;
	noValidate?: boolean;
};

export type UseFormReturn<T> = {
	methods: FormMethods;
	defaultValues: Partial<T> | undefined;
	errors: TFormErrors<T>;
	setRootError: (rootError: string | Array<string>) => void;
	reset: () => void;
	isPending: boolean;
};

const emptyErrors: TFormErrors<any> = { _root: [] };

export function useForm<T>(args: UseFormArgs<T>): UseFormReturn<T> & {
	createFields(fields: Omit<FormFieldProps<T>, "form">[]): FormFieldProps<T>[];
} {
	const [isPending, startPending] = useTransition();
	const [errors, setErrors] = useState<TFormErrors<T>>(emptyErrors);
	const ref = useRef<HTMLFormElement>(null);

	const onSubmit = useCallback(
		(e: React.SubmitEvent<HTMLFormElement>) => {
			e.preventDefault();
			startPending(async () => {
				const formData = new FormData(e.currentTarget);
				const formDataObject: Record<string, FormDataEntryValue | FormDataEntryValue[]> = {};

				for (const name of formData.keys()) {
					const allValues = formData.getAll(name);
					formDataObject[name] = allValues.length > 1 ? allValues : (allValues[0] ?? "");
				}

				if (import.meta.env.DEV) {
					console.log(formDataObject);
				}

				const result = await args.schema["~standard"].validate(formDataObject);

				if (result.issues !== undefined) {
					if (import.meta.env.DEV) {
						console.log(result.issues);
					}

					setErrors(Schema.issuesToErrorRecord<T>(result.issues));

					return;
				}
				setErrors(emptyErrors);
				const submitData = {
					values: result.value,
					defaultValues: args.defaultValues,
					formData,
				};
				await args.onSubmit(submitData);
			});
		},
		[args],
	);

	const onReset = useCallback(() => {
		ref.current?.reset();
		setErrors(emptyErrors);
		args.onReset?.();
	}, [args]);

	const reset = useCallback(() => {
		ref.current?.reset();
		setErrors(emptyErrors);
	}, []);

	const setRootError = useCallback((rootError: string | Array<string>) => {
		setErrors((prev) => ({
			...prev,
			_root: Array.isArray(rootError) ? rootError : [rootError],
		}));
	}, []);

	const form: UseFormReturn<T> = useMemo(
		() => ({
			methods: { onSubmit, onReset, ref, noValidate: args.noValidate ?? false },
			errors,
			defaultValues: args.defaultValues,
			reset,
			setRootError,
			isPending: args.mutation ? args.mutation.isPending : isPending,
		}),
		[isPending, reset, errors, onSubmit, onReset, setRootError, args],
	);

	function createFields(fields: Omit<FormFieldProps<T>, "form">[]): FormFieldProps<T>[] {
		return fields.map((field) => ({ ...field, form }));
	}

	return {
		...form,
		createFields,
	};
}
