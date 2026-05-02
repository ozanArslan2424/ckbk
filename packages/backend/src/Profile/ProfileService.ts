import { AuthException } from "@/Auth/AuthException";
import type { DatabaseClient } from "@/Database/DatabaseClient";
import { ProfileEntity } from "@/Profile/entities/ProfileEntity";
import { StatsEntity } from "@/Profile/entities/StatsEntity";
import type { ProfileType } from "@/Profile/ProfileModel";

export class ProfileService {
	constructor(private readonly db: DatabaseClient) {}

	static assertProfile(profile: ProfileEntity | undefined | null): asserts profile {
		if (!profile) {
			throw AuthException.unauthorized;
		}
	}

	async get(userId: string) {
		const user = await this.db.user.findUnique({
			where: { id: userId },
			include: { profile: true },
		});

		if (!user?.profile) {
			throw AuthException.profileNotFound;
		}
		return new ProfileEntity({ ...user.profile, emailVerified: user.emailVerified });
	}

	async create(body: ProfileType["create"]["body"], userId: string, email: string) {
		const user = await this.db.user.findUnique({ where: { id: userId } });

		const profileRaw = await this.db.profile.create({
			data: {
				userId: userId,
				email: email,
				name: body.name,
				language: body.language,
			},
		});

		return new ProfileEntity({ ...profileRaw, emailVerified: user?.emailVerified });
	}

	async stats(params: ProfileType["stats"]["params"]) {
		const profile = await this.db.profile.findUnique({ where: { id: params.id } });
		if (!profile) {
			throw AuthException.profileNotFound;
		}
		const where = { profileId: profile.id };

		const [latest, count, likes] = await Promise.all([
			this.db.recipe.findFirst({
				where,
				skip: 0,
				take: 1,
				orderBy: { createdAt: "desc" },
				select: { createdAt: true },
			}),
			this.db.recipe.count({ where }),
			this.db.like.count({ where }),
		]);

		return new StatsEntity({
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
