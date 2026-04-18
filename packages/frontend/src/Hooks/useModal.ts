import { useCallback, useId, useRef, useState } from "react";

import { prefixId } from "@/lib/utils";

export type ModalState<T = undefined> = {
	id: string;
	ref: React.RefObject<HTMLDivElement | null>;
	data: T | undefined;
	open: boolean;
	onOpenChange: (state: boolean) => void;
	handleOpen: (modalData?: T) => void;
};

export function useModal<T = undefined>() {
	const [data, setData] = useState<T | undefined>(undefined);
	const [open, onOpenChange] = useState(false);
	const generatedId = useId();
	const id = prefixId(generatedId, "modal");
	const ref = useRef<HTMLDivElement | null>(null);

	const handleOpen = useCallback((modalData?: T) => {
		setData(modalData);
		onOpenChange(true);
	}, []);

	return { id, ref, data, open, onOpenChange, handleOpen };
}
