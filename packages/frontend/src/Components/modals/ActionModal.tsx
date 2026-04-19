import {
	CommandModal,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/Components/ui/command";
import type { ModalState } from "@/Hooks/useModal";
import { useCommonLocale } from "@/Locale/useCommonLocale";

export type Action = {
	key: string;
	label: React.ReactNode;
	onSelect: (key: string) => void;
};

export function ActionModal<T>({
	actions,
	...rest
}: ModalState<T> & {
	title?: string;
	description?: string;
	className?: string;
	actions: Action[];
}) {
	const { txt } = useCommonLocale();

	return (
		<CommandModal showCloseButton={false} autoFocus {...rest}>
			<CommandList>
				<CommandEmpty>{txt.noResults}</CommandEmpty>
				<CommandGroup>
					{actions.map((action) => (
						<CommandItem
							key={action.key}
							value={action.key}
							onSelect={(key) => {
								rest.onOpenChange?.(false);
								action.onSelect(key);
							}}
							className="flex items-center justify-between"
						>
							{typeof action.label === "string" ? <span>{action.label}</span> : action.label}
						</CommandItem>
					))}

					<CommandItem
						value="close"
						onSelect={() => {
							rest.onOpenChange?.(false);
						}}
						className="flex items-center justify-between"
					>
						<span>{txt.close}</span>
					</CommandItem>
				</CommandGroup>
			</CommandList>
		</CommandModal>
	);
}
