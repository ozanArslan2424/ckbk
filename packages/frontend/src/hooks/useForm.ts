import type { UseMutationResult } from "@tanstack/react-query";
import { useCallback, useRef, useState, useTransition } from "react";

import type { FormFieldProps } from "@/components/form/FormField";
import { Schema } from "@/lib/Schema";

export type TFormErrors<T> = Record<keyof T | "_root", string[] | undefined>;

export type UseFormArgs<T, V = void, R = unknown, TOnMutateResult = unknown> = {
	schema: Schema.Schema<T>;
	onSubmit: (submitData: {
		values: T;
		formData: FormData;
		defaultValues?: Partial<T>;
	}) => void | Promise<void>;
	onReset?: () => void;
	defaultValues?: Partial<T>;
	mutation?: UseMutationResult<R, Error, V, TOnMutateResult>;
};

export type UseFormReturn<T, V = void, R = unknown, TOnMutateResult = unknown> = {
	methods: {
		onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
		onReset: () => void;
		ref: React.RefObject<HTMLFormElement | null>;
		noValidate?: boolean;
	};
	defaultValues: Partial<T> | undefined;
	errors: TFormErrors<T>;
	setRootError: (rootError: string | Array<string>) => void;
	reset: () => void;
	isPending: boolean;
	mutation?: UseMutationResult<R, Error, V, TOnMutateResult>;
};

const emptyErrors: TFormErrors<any> = { _root: [] };

export function useForm<T, V = void, R = unknown, TOnMutateResult = unknown>(
	args: UseFormArgs<T, V, R, TOnMutateResult>,
): UseFormReturn<T, V, R, TOnMutateResult> & {
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
					formDataObject[name] = allValues.length > 1 ? allValues : allValues[0] || "";
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

	const form: UseFormReturn<T, V, R, TOnMutateResult> = {
		methods: { onSubmit, onReset, ref, noValidate: true },
		errors,
		defaultValues: args.defaultValues,
		reset,
		setRootError,
		mutation: args.mutation,
		isPending: args.mutation ? args.mutation.isPending : isPending,
	};

	function createFields(fields: Omit<FormFieldProps<T>, "form">[]): FormFieldProps<T>[] {
		return fields.map((field) => ({ ...field, form }));
	}

	return {
		...form,
		createFields,
	};
}
