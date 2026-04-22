import type { DatabaseClient } from "@/Database/DatabaseClient";
import type { MaterialType } from "@/Material/MaterialModel";

export class MaterialService {
	constructor(private readonly db: DatabaseClient) {}

	async create(body: MaterialType["create"]["body"]): Promise<MaterialType["create"]["response"]> {
		return this.db.material.create({
			data: { title: body.title, description: body.description },
		});
	}

	async list(): Promise<MaterialType["list"]["response"]> {
		return this.db.material.findMany();
	}
}
