import { getCollections } from "@/Locale/getCollections";
import type {
	TranslatorCollectionKey,
	Translator,
	TranslatorCollection,
	TranslatorCollections,
} from "@/Locale/LocaleTypes";

export class LocaleService {
	constructor(
		readonly localeHeader: string = "x-lang",
		readonly fallback: string = "en-US",
	) {
		this.collections = getCollections();
	}

	private readonly collections: TranslatorCollections;

	getTranslator(locale: string, collectionKey: TranslatorCollectionKey): Translator {
		return (key, variables = {}) => {
			return this.translate(locale, collectionKey, key, variables);
		};
	}

	translate(
		locale: string,
		collectionKey: TranslatorCollectionKey,
		key: string,
		variables: Record<string, string> = {},
	): string {
		const collection = this.collections[collectionKey] as TranslatorCollection;
		let template = collection[key]?.[locale] ?? key;
		for (const [varKey, varVal] of Object.entries(variables)) {
			template = template.replace(new RegExp(`{{${varKey}}}`, "g"), varVal);
		}
		return template;
	}
}
