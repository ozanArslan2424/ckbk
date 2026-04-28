import React, { useEffect, useRef, useState } from "react";

import { Events } from "@/lib/Events";

type Source<Id extends string | number> = { sourceId: Id };
type Target<Id extends string | number> = { targetId: Id };

type UseDndOptions<S, T> = {
	onDrop: (sourceData: S, targetData: T) => void;
	format?: string;
	dropEffect?: "move" | "none" | "copy" | "link";
};

export type UseDndReturn<
	Id extends string | number = string,
	S extends Source<Id> = Source<Id>,
	T extends Target<Id> = Target<Id>,
> = {
	sourceId: Id | null;
	targetId: Id | null;
	isDragged: (id: Id) => boolean;
	isOver: (id: Id) => boolean;
	source: (sourceData: S) => React.HTMLAttributes<HTMLElement>;
	target: (targetData: T) => React.HTMLAttributes<HTMLElement>;
	ghost: () => React.ComponentPropsWithRef<"div">;
};

export function useDragDrop<
	Id extends string | number = string,
	S extends Source<Id> = Source<Id>,
	T extends Target<Id> = Target<Id>,
>({
	onDrop,
	format = "application/json",
	dropEffect = "move",
}: UseDndOptions<S, T>): UseDndReturn<Id, S, T> {
	const [sourceId, setSourceId] = useState<Id | null>(null);
	const [targetId, setTargetId] = useState<Id | null>(null);
	const ghostRef = useRef<HTMLDivElement | null>(null);
	const ghostContainerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const container = document.createElement("div");
		container.style.position = "fixed";
		container.style.top = "-10000px";
		container.style.left = "-10000px";
		container.style.pointerEvents = "none";
		document.body.appendChild(container);
		ghostContainerRef.current = container;
		return () => {
			container.remove();
			ghostContainerRef.current = null;
		};
	}, []);

	const cleanup = () => {
		setSourceId(null);
		setTargetId(null);
		ghostContainerRef.current?.replaceChildren();
	};

	const onDragStartFactory = Events.drag<[S]>((e, sourceData) => {
		e.dataTransfer.setData(format, JSON.stringify(sourceData));
		setSourceId(sourceData.sourceId);
		if (!ghostRef.current || !ghostContainerRef.current) return;
		ghostContainerRef.current.replaceChildren(ghostRef.current);
		e.dataTransfer.setDragImage(ghostContainerRef.current, 0, 0);
	});

	const onDragOverFactory = Events.drag<[Id]>((e, overId) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = dropEffect;
		setTargetId(overId);
	});

	const onDragLeaveFactory = Events.drag((e) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "none";
		setTargetId(null);
	});

	const onDropFactory = Events.drag<[T]>((e, targetData) => {
		e.preventDefault();
		const transferData = e.dataTransfer.getData(format);
		try {
			const sourceData = JSON.parse(transferData);
			onDrop(sourceData, targetData);
		} catch (err) {
			console.log("DND DATA JSON ERROR:", err);
		}
		cleanup();
	});

	const onDragEndFactory = Events.drag(() => {
		cleanup();
	});

	const isOver = (id: Id): boolean => {
		if (targetId == null) return false;
		return String(targetId) === String(id);
	};

	const isDragged = (id: Id): boolean => {
		if (sourceId == null) return false;
		return String(sourceId) === String(id);
	};

	const target = (targetData: T): React.HTMLAttributes<HTMLElement> => ({
		onDragOver: onDragOverFactory(targetData.targetId),
		onDragLeave: onDragLeaveFactory(),
		onDrop: onDropFactory(targetData),
	});

	const source = (sourceData: S): React.HTMLAttributes<HTMLElement> => ({
		draggable: true,
		onDragStart: onDragStartFactory(sourceData),
		onDragEnd: onDragEndFactory(),
	});

	const ghost = (): React.ComponentPropsWithRef<"div"> => ({
		ref: ghostRef,
		style: { position: "absolute", top: -9999 },
	});

	return {
		sourceId,
		targetId,
		isOver,
		isDragged,
		source,
		target,
		ghost,
	};
}
