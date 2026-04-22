import { useModal } from "@/hooks/useModal";
import { prefixId } from "@/lib/utils";

export function useActionModal() {
	const { id, ...modal } = useModal();
	return { ...modal, id: prefixId(id, "action") };
}
