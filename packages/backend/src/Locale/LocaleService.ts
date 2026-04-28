import { C } from "@ozanarslan/corpus";

import type {
	TranslatorCollectionKey,
	Translator,
	TranslatorCollection,
} from "@/Locale/LocaleTypes";

import collections from "./locales";

export class LocaleService {
	constructor(
		readonly localeHeader: string = "x-lang",
		readonly fallback: string = "en-US",
	) {}

	getLocale(headers: C.Headers) {
		return headers.get(this.localeHeader) ?? this.fallback;
	}

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
		const collection = collections[collectionKey] as TranslatorCollection;
		let template = collection[key]?.[locale] ?? key;
		for (const [varKey, varVal] of Object.entries(variables)) {
			template = template.replace(new RegExp(`{{${varKey}}}`, "g"), varVal);
		}
		return template;
	}
}
