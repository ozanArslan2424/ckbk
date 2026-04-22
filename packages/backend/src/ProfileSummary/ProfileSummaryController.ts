import { C } from "@ozanarslan/corpus";

import { ProfileSummaryModel } from "@/ProfileSummary/ProfileSummaryModel";
import type { ProfileSummaryService } from "@/ProfileSummary/ProfileSummaryService";

export class ProfileSummaryController extends C.Controller {
	constructor(private readonly service: ProfileSummaryService) {
		super();
	}

	override prefix?: string | undefined = "/profile-summary";

	get = this.route("/", async (c) => this.service.get(c.params), ProfileSummaryModel.get);
}
