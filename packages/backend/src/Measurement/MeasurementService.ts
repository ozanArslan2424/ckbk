import type { DatabaseClient } from "@/Database/DatabaseClient";
import type { MeasurementType } from "@/Measurement/MeasurementModel";

export class MeasurementService {
	constructor(private readonly db: DatabaseClient) {}

	async create(
		body: MeasurementType["create"]["body"],
	): Promise<MeasurementType["create"]["response"]> {
		return this.db.measurement.create({
			data: { title: body.title, description: body.description },
		});
	}

	async list(): Promise<MeasurementType["list"]["response"]> {
		return this.db.measurement.findMany();
	}
}
