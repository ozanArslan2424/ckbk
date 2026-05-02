import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useId } from "react";

import { useAppContext } from "@/app/AppContext";
import type { IngredientPatch, IngredientDraft } from "@/app/Ingredient/IngredientComplete";
import { Combobox } from "@/components/form/Combobox";
import { Events } from "@/lib/Events";
import { TXT } from "@/lib/TXT";
import { useLocale } from "@/locale/useLocale";

type IngredientFormFieldProps = {
	ingredient: IngredientDraft | undefined;
	usedIngredients: IngredientDraft[];
	onChange: (patch: IngredientPatch) => void;
};

export function IngredientFormField(props: IngredientFormFieldProps) {
	const { materialClient, measurementClient } = useAppContext();
	const uid = useId();

	const { txt } = useLocale("app", {
		materialLabel: ["form.material.label"],
		materialPlaceholder: ["form.material.placeholder"],
		quantityLabel: ["form.quantity.label"],
		measurementLabel: ["form.measurement.label"],
		measurementPlaceholder: ["form.measurement.placeholder"],
	});

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
					props.onChange({ materialId: res.id });
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
					props.onChange({ measurementId: res.id });
				},
			},
		),
	);

	const handleChangeQuantity = Events.blurChange((e) => {
		const value = parseFloat(e.target.value);
		if (TXT.isDefined(e.target.value) && Number.isFinite(value) && value > 0) {
			props.onChange({ quantity: value });
		}
	})();

	const handleCreateMaterial = (title: string) => {
		materialCreateMut.mutate({ body: { title, description: null } });
	};

	const handleChangeMaterial = (value: string | null) => {
		if (value) props.onChange({ materialId: parseInt(value) });
	};

	const handleCreateMeasurement = (title: string) => {
		measurementCreateMut.mutate({ body: { title, description: null } });
	};

	const handleChangeMeasurement = (value: string | null) => {
		if (value) props.onChange({ measurementId: parseInt(value) });
	};

	return (
		<div className="grid grid-cols-12">
			<div className="col-span-5">
				<label className="text-muted-foreground text-xs font-semibold">{txt.materialLabel}</label>
				<Combobox
					value={props.ingredient?.materialId?.toString()}
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
				<label className="text-muted-foreground text-xs font-semibold">{txt.quantityLabel}</label>
				<input
					className="rounded-none"
					id={`${uid}-q`}
					name={`${uid}-q`}
					type="number"
					step="0.25"
					min="0"
					value={props.ingredient?.quantity ?? ""}
					onChange={handleChangeQuantity}
					onBlur={handleChangeQuantity}
				/>
			</div>
			<div className="col-span-4">
				<label className="text-muted-foreground text-xs font-semibold">
					{txt.measurementLabel}
				</label>
				<Combobox
					value={props.ingredient?.measurementId?.toString()}
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
