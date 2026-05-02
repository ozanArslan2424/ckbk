import type { DatabaseClient } from "@/Database/DatabaseClient";
import type { MeasurementType } from "@/Measurement/MeasurementModel";
import type { ProfileEntity } from "@/Profile/entities/ProfileEntity";

export class MeasurementService {
	constructor(private readonly db: DatabaseClient) {}

	async create(body: MeasurementType["create"]["body"], profile: ProfileEntity) {
		return this.db.measurement.create({
			data: { title: body.title, description: body.description, language: profile.language },
		});
	}

	async list(profile: ProfileEntity) {
		return this.db.measurement.findMany({
			where: { language: profile.language },
		});
	}
}
