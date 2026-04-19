import { useMutation } from "@tanstack/react-query";
import { useState, useRef, useCallback, useId, type Dispatch, type SetStateAction } from "react";

import type { Entities } from "@/Api/CorpusApi";
import { useAppContext } from "@/App/AppContext";
import { Combobox, type ComboboxOption } from "@/Components/form/Combobox";
import { Events } from "@/lib/events";
import { TXT } from "@/lib/TXT";
import { useLocale } from "@/Locale/useLocale";
import type { IngredientComplete } from "@/Types/IngredientComplete";

type IngredientFormFieldProps = {
	ingredient: IngredientComplete | undefined;
	onComplete: (ingredient: IngredientComplete) => void;
	materialOptions: ComboboxOption[];
	setMaterialOptions: Dispatch<SetStateAction<ComboboxOption[]>>;
	measurementOptions: ComboboxOption[];
	setMeasurementOptions: Dispatch<SetStateAction<ComboboxOption[]>>;
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

	const uid = useId();
	const submittedRef = useRef(false);
	const materialCreateMut = useMutation(
		materialClient.create({
			onSuccess(res) {
				updateIngredient({ materialId: res.id });
				props.setMaterialOptions((p) => [...p, { value: res.id.toString(), label: res.title }]);
			},
		}),
	);
	const measurementCreateMut = useMutation(
		measurementClient.create({
			onSuccess(res) {
				updateIngredient({ measurementId: res.id });
				props.setMeasurementOptions((p) => [...p, { value: res.id.toString(), label: res.title }]);
			},
		}),
	);

	const trySubmit = useCallback(
		(next: Partial<Entities.Ingredient>) => {
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
				materialId: next.materialId,
				measurementId: next.measurementId,
				quantity: next.quantity,
			});
		},

		[props.onComplete],
	);

	const updateIngredient = useCallback(
		(partial: Partial<Entities.Ingredient>) => {
			submittedRef.current = false;
			setIngredient((prev) => {
				const next = { ...prev, ...partial };
				trySubmit(next);
				return next;
			});
		},
		[trySubmit],
	);

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
					options={props.materialOptions}
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
					options={props.measurementOptions}
					onCreateOption={({ label }) => handleCreateMeasurement(label)}
					onValueChange={handleChangeMeasurement}
				/>
			</div>
		</div>
	);
}
