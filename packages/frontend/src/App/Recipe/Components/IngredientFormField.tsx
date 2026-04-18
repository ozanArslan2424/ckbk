import { useMutation } from "@tanstack/react-query";
import { useState, useRef, useCallback, useId } from "react";

import type { Entities } from "@/Api/CorpusApi";
import { Combobox } from "@/Components/form/Combobox";
import { useAppContext } from "@/Context/AppContext";
import { Events } from "@/lib/events";
import { TXT } from "@/lib/TXT";
import type { IngredientComplete } from "@/Types/IngredientComplete";

type IngredientFormFieldProps = {
	ingredient: IngredientComplete | undefined;
	onComplete: (ingredient: IngredientComplete) => void;
	measurements: Entities.Measurement[];
	materials: Entities.Material[];
};

export function IngredientFormField(props: IngredientFormFieldProps) {
	const { materialClient, measurementClient } = useAppContext();
	const [ingredient, setIngredient] = useState<Partial<IngredientComplete>>(props.ingredient ?? {});
	const [measurementOptions, setMeasurementOptions] = useState(
		props.measurements.map((m) => ({
			value: m.id.toString(),
			label: m.title,
		})),
	);
	const [materialOptions, setMaterialOptions] = useState(() =>
		props.materials.map((m) => ({
			value: m.id.toString(),
			label: m.title,
		})),
	);

	const uid = useId();
	const submittedRef = useRef(false);

	// const trySubmit = useCallback(
	// 	(next: Partial<Entities.Ingredient>) => {
	// 		if (
	// 			submittedRef.current ||
	// 			!next.materialId ||
	// 			!next.measurementId ||
	// 			next.quantity === undefined ||
	// 			next.quantity <= 0 ||
	// 			!Number.isFinite(next.quantity)
	// 		) {
	// 			return;
	// 		}
	// 		submittedRef.current = true;
	// 		onComplete({
	// 			materialId: next.materialId,
	// 			measurementId: next.measurementId,
	// 			quantity: next.quantity,
	// 		});
	// 	},
	// 	[onComplete],
	// );

	const updateIngredient = useCallback(
		(partial: Partial<Entities.Ingredient>) => {
			submittedRef.current = false;
			setIngredient((prev) => {
				const next = { ...prev, ...partial };

				if (
					!submittedRef.current &&
					next.materialId &&
					next.measurementId &&
					next.quantity !== undefined &&
					next.quantity > 0 &&
					Number.isFinite(next.quantity)
				) {
					submittedRef.current = true;
					props.onComplete({
						materialId: next.materialId,
						measurementId: next.measurementId,
						quantity: next.quantity,
					});
				}

				return next;
			});
		},
		[props.onComplete],
	);

	const materialCreateMut = useMutation(
		materialClient.create({
			onSuccess(res) {
				updateIngredient({ materialId: res.id });
				setMaterialOptions((p) => [...p, { value: res.id.toString(), label: res.title }]);
			},
		}),
	);

	const handleCreateMaterial = (title: string) => {
		materialCreateMut.mutate({ body: { title, description: null } });
	};
	const handleChangeMaterial = (value: string | null) => {
		if (value) updateIngredient({ materialId: parseInt(value) });
	};

	const handleBlurQuantity = Events.focus((e) => {
		const value = parseFloat(e.target.value);
		if (TXT.isDefined(e.target.value) && Number.isFinite(value) && value > 0) {
			updateIngredient({ quantity: value });
		}
	});
	const handleChangeQuantity = Events.change((e) => {
		const value = parseFloat(e.target.value);
		if (TXT.isDefined(e.target.value) && Number.isFinite(value) && value > 0) {
			updateIngredient({ quantity: value });
		}
	});

	const measurementCreateMut = useMutation(
		measurementClient.create({
			onSuccess(res) {
				updateIngredient({ measurementId: res.id });
				setMeasurementOptions((p) => [...p, { value: res.id.toString(), label: res.title }]);
			},
		}),
	);

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
					Material
				</label>
				<Combobox
					value={ingredient.materialId?.toString()}
					className="rounded-r-none"
					id={`${uid}-ma`}
					name={`${uid}-ma`}
					placeholder="e.g. Water"
					options={materialOptions}
					onCreateOption={({ label }) => handleCreateMaterial(label)}
					onValueChange={handleChangeMaterial}
				/>
			</div>
			<div className="col-span-3">
				<label htmlFor={`${uid}-q`} className="text-muted-foreground text-xs font-semibold">
					Quantity
				</label>
				<input
					className="rounded-none"
					id={`${uid}-q`}
					name={`${uid}-q`}
					type="number"
					step="0.25"
					min="0"
					value={ingredient.quantity}
					onChange={handleChangeQuantity()}
					onBlur={handleBlurQuantity()}
				/>
			</div>
			<div className="col-span-4">
				<label htmlFor={`${uid}-me`} className="text-muted-foreground text-xs font-semibold">
					Measurement
				</label>
				<Combobox
					value={ingredient.measurementId?.toString()}
					className="rounded-l-none"
					id={`${uid}-me`}
					name={`${uid}-me`}
					placeholder="e.g. Cup"
					options={measurementOptions}
					onCreateOption={({ label }) => handleCreateMeasurement(label)}
					onValueChange={handleChangeMeasurement}
				/>
			</div>
		</div>
	);
}
