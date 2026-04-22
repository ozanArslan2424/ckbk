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
	onComplete: (ingredient: IngredientComplete) => void;
};

export function IngredientFormField(props: IngredientFormFieldProps) {
	const { txt } = useLocale("app", {
		materialLabel: ["form.material.label"],
		materialPlaceholder: ["form.material.placeholder"],
		quantityLabel: ["form.quantity.label"],
		measurementLabel: ["form.measurement.label"],
		measurementPlaceholder: ["form.measurement.placeholder"],
	});
	const { materialClient, measurementClient } = useAppContext();
	const [ingredient, setIngredient] = useState<Partial<IngredientComplete>>(props.ingredient ?? {});
	const materialListQuery = useSuspenseQuery(materialClient.list({}));
	const measurementListQuery = useSuspenseQuery(measurementClient.list({}));
	const [measurementOptions, setMeasurementOptions] = useState(
		measurementListQuery.data.map((m) => ({
			value: m.id.toString(),
			label: m.title,
		})),
	);
	const [materialOptions, setMaterialOptions] = useState(() =>
		materialListQuery.data.map((m) => ({
			value: m.id.toString(),
			label: m.title,
		})),
	);

	const uid = useId();
	const submittedRef = useRef(false);
	const materialCreateMut = useMutation(
		materialClient.create(
			{},
			{
				onSuccess(res) {
					updateIngredient({ materialId: res.id });
					setMaterialOptions((p) => [...p, { value: res.id.toString(), label: res.title }]);
				},
			},
		),
	);
	const measurementCreateMut = useMutation(
		measurementClient.create(
			{},
			{
				onSuccess(res) {
					updateIngredient({ measurementId: res.id });
					setMeasurementOptions((p) => [...p, { value: res.id.toString(), label: res.title }]);
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

	const onBlurQuantityFactory = Events.focus((e) => {
		const value = parseFloat(e.target.value);
		if (TXT.isDefined(e.target.value) && Number.isFinite(value) && value > 0) {
			updateIngredient({ quantity: value });
		}
	});
	const onChangeQuantityFactory = Events.change((e) => {
		const value = parseFloat(e.target.value);
		if (TXT.isDefined(e.target.value) && Number.isFinite(value) && value > 0) {
			updateIngredient({ quantity: value });
		}
	});

	const handleCreateMaterial = (title: string) => {
		materialCreateMut.mutate({ body: { title, description: null } });
	};
	const handleChangeMaterial = (value: string | null) => {
		if (value) updateIngredient({ materialId: parseInt(value) });
	};
	const handleChangeQuantity = onChangeQuantityFactory();
	const handleBlurQuantity = onBlurQuantityFactory();
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
					options={materialOptions}
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
					onBlur={handleBlurQuantity}
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
					options={measurementOptions}
					onCreateOption={({ label }) => handleCreateMeasurement(label)}
					onValueChange={handleChangeMeasurement}
				/>
			</div>
		</div>
	);
}
