import type { Entities } from "@/Api/CorpusApi";

declare global {
	export interface StoreSchema {
		accessToken: string | null;
		auth: Entities.Profile | null;
	}
}
