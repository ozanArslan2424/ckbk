import type { UseFormReturn } from "@/hooks/useForm";

type FormRootErrorProps<F> = {
	form: UseFormReturn<F, any, any, any>;
};

export function FormRootError<F>(props: FormRootErrorProps<F>) {
	const errors = props.form.errors._root;
	const errorMessage = errors?.join(", ");

	if (errors?.length === 0) return null;

	return (
		<div className="rounded-md bg-rose-400/10 px-5 py-2 text-center text-sm font-semibold text-rose-500">
			<p>{errorMessage}</p>
		</div>
	);
}
