import { PersonAvatar } from "@/components/PersonAvatar";
import { useDate } from "@/hooks/useDate";
import type { Entities } from "@/lib/CorpusApi";
import { useLocale } from "@/locale/useLocale";

type Props = {
	stats: Entities.Stats;
};

export function StatsCard({ stats }: Props) {
	const { timestamp } = useDate();
	const { txt } = useLocale("dashboard", {
		joined: ["stats.joined", { date: timestamp(stats.joined).shortDate }],
		contributions: ["stats.contributions"],
		likes: ["stats.likes"],
		lastActive: ["stats.lastActive", { date: timestamp(stats.lastActive).shortDateTime }],
		lastRecipe: [
			"stats.lastRecipe",
			{ date: stats.lastContribution ? timestamp(stats.lastContribution).shortDate : "" },
		],
	});
	return (
		<div className="card">
			<article className="flex flex-col gap-3">
				<div className="flex items-center gap-3">
					<PersonAvatar person={stats} />
					<div className="flex flex-col">
						<span className="text-foreground text-sm font-semibold">{stats.name}</span>
						<span className="text-muted-foreground text-xs">{txt.joined}</span>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-2">
					<div className="flex flex-col">
						<span className="text-foreground text-lg font-bold">{stats.contributionCount}</span>
						<span className="text-muted-foreground text-xs">{txt.contributions}</span>
					</div>
					<div className="flex flex-col">
						<span className="text-foreground text-lg font-bold">{stats.likeCount}</span>
						<span className="text-muted-foreground text-xs">{txt.likes}</span>
					</div>
				</div>
				<div className="border-border flex flex-col gap-1 border-t pt-2">
					<div className="text-muted-foreground text-xs">{txt.lastActive}</div>
					{stats.lastContribution && (
						<div className="text-muted-foreground text-xs">{txt.lastRecipe}</div>
					)}
				</div>
			</article>
		</div>
	);
}
