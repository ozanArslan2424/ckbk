import type { DatabaseClient } from "@/Database/DatabaseClient";
import type { MaterialType } from "@/Material/MaterialModel";
import type { ProfileEntity } from "@/Profile/entities/ProfileEntity";

export class MaterialService {
	constructor(private readonly db: DatabaseClient) {}

	async create(body: MaterialType["create"]["body"], profile: ProfileEntity) {
		return this.db.material.create({
			data: { title: body.title, description: body.description, language: profile.language },
		});
	}

	async list(profile: ProfileEntity) {
		return this.db.material.findMany({
			where: { language: profile.language },
		});
	}
}
