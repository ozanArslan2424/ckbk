import type { Entities } from "@/lib/CorpusApi";

declare global {
	export interface StoreSchema {
		accessToken: string | null;
		auth: Entities.Profile | null;
	}
}
