import { C } from "@ozanarslan/corpus";

import type {
	TranslatorCollectionKey,
	Translator,
	TranslatorCollection,
} from "@/Locale/LocaleTypes";

import collections from "./locales";

export class LocaleService {
	constructor(
		readonly languageHeader: string = "x-lang",
		readonly fallbackLanguage: string = "en-US",
	) {
		this.storedLanguage = fallbackLanguage;
	}

	storedLanguage: string;

	setLanguage(headers: C.Headers) {
		this.storedLanguage = headers.get(this.languageHeader) || this.fallbackLanguage;
	}

	getLanguage() {
		return this.storedLanguage || this.fallbackLanguage;
	}

	makeTranslator(collectionKey: TranslatorCollectionKey): Translator {
		return (key, variables = {}) => {
			return this.translate(collectionKey, key, variables);
		};
	}

	translate(
		collectionKey: TranslatorCollectionKey,
		key: string,
		variables: Record<string, string> = {},
	): string {
		const lang = this.getLanguage();
		const collection = this.getCollection(collectionKey);
		const template = this.getTemplate(collection, key, lang);
		return this.replaceVariables(template, variables);
	}

	private replaceVariables(template: string, variables: Record<string, string> = {}) {
		for (const [varKey, varVal] of Object.entries(variables)) {
			template = template.replace(new RegExp(`{{${varKey}}}`, "g"), varVal);
		}
		return template;
	}

	private getTemplate(collection: TranslatorCollection, key: string, lang: string): string {
		return collection[key]?.[lang] || key;
	}

	private getCollection(collectionKey: TranslatorCollectionKey): TranslatorCollection {
		return collections[collectionKey];
	}
}
