import { useCallback, useState, type ComponentProps, type DragEvent } from "react";

type Id = string;
type SDataBase = { sourceId: Id };
type TDataBase = { targetId: Id };

type UseDndOptions<S, T> = {
	onDrop: (sourceData: S, targetData: T) => void;
	format?: string;
	dropEffect?: "move" | "none" | "copy" | "link";
};

export type UseDndReturn<S = SDataBase, T = TDataBase> = {
	getIsDragged: (id: Id) => boolean;
	getIsOver: (id: Id) => boolean;
	registerSource: (sourceData: S) => ComponentProps<"div">;
	registerTarget: (targetData: T) => ComponentProps<"div">;
};

export function useDnd<S extends SDataBase = SDataBase, T extends TDataBase = TDataBase>({
	onDrop,
	format = "application/json",
	dropEffect = "move",
}: UseDndOptions<S, T>): UseDndReturn<S, T> {
	const [sourceId, setSourceId] = useState<Id | null>(null);
	const [targetId, setTargetId] = useState<Id | null>(null);

	const handleDragStart = useCallback(
		(e: DragEvent<HTMLElement>, sourceData: S) => {
			e.dataTransfer.setData(format, JSON.stringify(sourceData));
			setSourceId(sourceData.sourceId);
		},
		[format],
	);

	const handleDragOver = useCallback(
		(e: DragEvent<HTMLElement>, overId: Id) => {
			e.preventDefault();
			e.dataTransfer.dropEffect = dropEffect;
			setTargetId(overId);
		},
		[dropEffect],
	);

	const handleDragLeave = useCallback((e: DragEvent<HTMLElement>) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "none";
		setTargetId(null);
	}, []);

	const handleDrop = useCallback(
		(e: DragEvent<HTMLElement>, targetData: T) => {
			e.preventDefault();
			const transferData = e.dataTransfer.getData(format);
			setSourceId(null);
			setTargetId(null);
			try {
				const sourceData = JSON.parse(transferData);
				onDrop(sourceData, targetData);
			} catch (err) {
				console.log("DND DATA JSON ERROR:", err);
			}
		},
		[onDrop, format],
	);

	const handleDragEnd = useCallback(() => {
		setSourceId(null);
		setTargetId(null);
	}, []);

	const getIsOver = useCallback(
		(id: Id) => {
			if (!targetId) return false;
			return targetId.toString() === id.toString();
		},
		[targetId],
	);

	const getIsDragged = useCallback(
		(id: Id) => {
			if (!sourceId) return false;
			return sourceId.toString() === id.toString();
		},
		[sourceId],
	);

	const registerTarget = useCallback(
		(targetData: T): ComponentProps<"div"> => ({
			onDragOver: (e) => handleDragOver(e, targetData.targetId),
			onDragLeave: handleDragLeave,
			onDrop: (e) => handleDrop(e, targetData),
		}),
		[handleDragOver, handleDragLeave, handleDrop],
	);

	const registerSource = useCallback(
		(sourceData: S): ComponentProps<"div"> => ({
			draggable: true,
			onDragStart: (e) => handleDragStart(e, sourceData),
			onDragEnd: handleDragEnd,
		}),
		[handleDragStart, handleDragEnd],
	);

	return {
		getIsOver,
		getIsDragged,
		registerSource,
		registerTarget,
	};
}
