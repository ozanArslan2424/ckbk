import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useState, useRef, useId } from "react";

import { useAppContext } from "@/app/AppContext";
import type { IngredientComplete } from "@/app/Ingredient/Types/IngredientComplete";
import { Combobox } from "@/components/form/Combobox";
import { useLocale } from "@/hooks/useLocale";
import type { Entities } from "@/lib/CorpusApi";
import { Events } from "@/lib/Events";
import { TXT } from "@/lib/TXT";

type IngredientFormFieldProps = {
	ingredientCount: number;
	ingredient: IngredientComplete | undefined;
	usedIngredients: IngredientComplete[];
	onComplete: (ingredient: IngredientComplete) => void;
};

export function IngredientFormField(props: IngredientFormFieldProps) {
	const uid = useId();

	const submittedRef = useRef(false);

	const { txt } = useLocale("app", {
		materialLabel: ["form.material.label"],
		materialPlaceholder: ["form.material.placeholder"],
		quantityLabel: ["form.quantity.label"],
		measurementLabel: ["form.measurement.label"],
		measurementPlaceholder: ["form.measurement.placeholder"],
	});

	const { materialClient, measurementClient } = useAppContext();

	const [ingredient, setIngredient] = useState<Partial<IngredientComplete>>(props.ingredient ?? {});

	const materialOptions = useSuspenseQuery({
		...materialClient.list({}),
		select: (data) =>
			data
				.filter((m) => !props.usedIngredients.some((ing) => ing.materialId === m.id))
				.map((m) => ({ value: m.id.toString(), label: m.title })),
	});

	const materialCreateMut = useMutation(
		materialClient.create(
			{},
			{
				onSuccess: (res) => {
					updateIngredient({ materialId: res.id });
				},
			},
		),
	);

	const measurementOptions = useSuspenseQuery({
		...measurementClient.list({}),
		select: (data) =>
			data
				.filter((m) => !props.usedIngredients.some((ing) => ing.measurementId === m.id))
				.map((m) => ({ value: m.id.toString(), label: m.title })),
	});

	const measurementCreateMut = useMutation(
		measurementClient.create(
			{},
			{
				onSuccess: (res) => {
					updateIngredient({ measurementId: res.id });
				},
			},
		),
	);

	const trySubmit = (next: Partial<Entities.Ingredient>) => {
		if (
			submittedRef.current ||
			!next.materialId ||
			!next.measurementId ||
			next.quantity === undefined ||
			next.quantity <= 0 ||
			!Number.isFinite(next.quantity)
		) {
			return;
		}

		submittedRef.current = true;

		props.onComplete({
			id: props.ingredient?.id ?? -props.ingredientCount,
			materialId: next.materialId,
			measurementId: next.measurementId,
			quantity: next.quantity,
		});
	};

	const updateIngredient = (partial: Partial<Entities.Ingredient>) => {
		submittedRef.current = false;
		setIngredient((prev) => {
			const next = { ...prev, ...partial };
			trySubmit(next);
			return next;
		});
	};

	const handleChangeQuantity = Events.blurChange((e) => {
		const value = parseFloat(e.target.value);
		if (TXT.isDefined(e.target.value) && Number.isFinite(value) && value > 0) {
			updateIngredient({ quantity: value });
		}
	})();

	const handleCreateMaterial = (title: string) => {
		materialCreateMut.mutate({ body: { title, description: null } });
	};

	const handleChangeMaterial = (value: string | null) => {
		if (value) updateIngredient({ materialId: parseInt(value) });
	};

	const handleCreateMeasurement = (title: string) => {
		measurementCreateMut.mutate({ body: { title, description: null } });
	};

	const handleChangeMeasurement = (value: string | null) => {
		if (value) updateIngredient({ measurementId: parseInt(value) });
	};

	return (
		<div className="grid grid-cols-12">
			<div className="col-span-5">
				<label htmlFor={`${uid}-ma`} className="text-muted-foreground text-xs font-semibold">
					{txt.materialLabel}
				</label>
				<Combobox
					value={ingredient.materialId?.toString()}
					className="rounded-r-none"
					id={`${uid}-ma`}
					name={`${uid}-ma`}
					placeholder={txt.materialPlaceholder}
					options={materialOptions.data}
					onCreateOption={({ label }) => handleCreateMaterial(label)}
					onValueChange={handleChangeMaterial}
				/>
			</div>
			<div className="col-span-3">
				<label htmlFor={`${uid}-q`} className="text-muted-foreground text-xs font-semibold">
					{txt.quantityLabel}
				</label>
				<input
					className="rounded-none"
					id={`${uid}-q`}
					name={`${uid}-q`}
					type="number"
					step="0.25"
					min="0"
					value={ingredient.quantity}
					onChange={handleChangeQuantity}
					onBlur={handleChangeQuantity}
				/>
			</div>
			<div className="col-span-4">
				<label htmlFor={`${uid}-me`} className="text-muted-foreground text-xs font-semibold">
					{txt.measurementLabel}
				</label>
				<Combobox
					value={ingredient.measurementId?.toString()}
					className="rounded-l-none"
					id={`${uid}-me`}
					name={`${uid}-me`}
					placeholder={txt.measurementPlaceholder}
					options={measurementOptions.data}
					onCreateOption={({ label }) => handleCreateMeasurement(label)}
					onValueChange={handleChangeMeasurement}
				/>
			</div>
		</div>
	);
}
