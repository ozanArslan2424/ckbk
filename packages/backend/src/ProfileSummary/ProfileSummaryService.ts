import { C } from "@ozanarslan/corpus";

import type { DatabaseClient } from "@/Database/DatabaseClient";
import { ProfileSummaryEntity } from "@/ProfileSummary/ProfileSummaryEntity";
import type { ProfileSummaryType } from "@/ProfileSummary/ProfileSummaryModel";

export class ProfileSummaryService {
	constructor(private readonly db: DatabaseClient) {}

	async get(
		params: ProfileSummaryType["get"]["params"],
	): Promise<ProfileSummaryType["get"]["response"]> {
		const profile = await this.db.profile.findUnique({ where: { id: params.id } });
		if (!profile) {
			throw new C.Exception("Profile not found", C.Status.NOT_FOUND);
		}
		const where = { profileId: profile.id };
		const latestPromise = this.db.recipe.findFirst({
			where,
			skip: 0,
			take: 1,
			orderBy: { createdAt: "desc" },
			select: { createdAt: true },
		});
		const countPromise = this.db.recipe.count({ where });
		const likesPromise = this.db.like.count({ where });
		const [latest, count, likes] = await Promise.all([latestPromise, countPromise, likesPromise]);

		return new ProfileSummaryEntity({
			name: profile.name,
			image: profile.image,
			joined: profile.createdAt,
			likeCount: likes,
			lastContribution: latest?.createdAt ?? null,
			lastActive: new Date(),
			contributionCount: count,
		});
	}
}
