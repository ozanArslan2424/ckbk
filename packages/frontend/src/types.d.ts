import type { Entities } from "@/lib/CorpusApi";

declare global {
	interface StoreSchema {
		accessToken: string | null;
		auth: Entities.Profile | null;
		locale: string;
	}
}

export {};
