import type { Help } from "@/lib/Help";
import { cn } from "@/lib/utils";

export function PersonAvatar<
	T extends {
		name: string;
		image?: Help.Maybe<string>;
	},
>({ person, className }: { person: T; className?: string }) {
	const initials = person.name
		.split(" ")
		.map((p) => p[0]?.toLocaleUpperCase())
		.slice(0, 2)
		.join("");

	if (person.image) {
		return (
			<div className={cn("inline size-10 shrink-0 overflow-hidden rounded-md", className)}>
				<img className="aspect-square size-full" src={person.image} alt={person.name} />
			</div>
		);
	}

	return (
		<div
			className={cn(
				"bg-secondary text-secondary-foreground inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md text-sm font-bold capitalize no-underline select-none",
				className,
			)}
		>
			{initials}
		</div>
	);
}
