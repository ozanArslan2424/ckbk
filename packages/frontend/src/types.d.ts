import type { Entities } from "@/lib/CorpusApi";

declare global {
	interface StoreSchema {
		auth: Entities.Profile | null;
		locale: string;
	}
}

export {};
