import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import isBetween from "dayjs/plugin/isBetween";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/tr";
import "dayjs/locale/en";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import type { Store } from "@/lib/Store";

import en from "./en";
import tr from "./tr";

export const locales = { en, tr };

export type LocaleOpt = keyof typeof locales;

export type NS = keyof (typeof locales)["en"];

export const LOCALE_OPTIONS = ["en", "tr"] satisfies LocaleOpt[];

let initialized = false;

export class Locale {
	readonly initial: LocaleOpt;

	constructor(readonly fallback: LocaleOpt = "en") {
		this.initial = this.setup();
	}

	subscribe(store: Store) {
		store.subscribe("locale", (lng) => {
			if (!lng) return;
			if (i18n.language !== lng) {
				void i18n.changeLanguage(lng);
			}
			dayjs.locale(lng);
		});
	}

	private setup(): LocaleOpt {
		if (initialized) return i18n.language as LocaleOpt;
		initialized = true;

		dayjs.extend(advancedFormat);
		dayjs.extend(utc);
		dayjs.extend(timezone);
		dayjs.extend(isBetween);
		dayjs.extend(relativeTime);

		void i18n
			.use(LanguageDetector)
			.use(initReactI18next)
			.init({
				fallbackLng: this.fallback,
				interpolation: { escapeValue: false },
				resources: locales,
				detection: {
					order: ["localStorage", "navigator", "htmlTag"],
					caches: ["localStorage"],
				},
			});

		dayjs.locale(i18n.language);

		return i18n.language as LocaleOpt;
	}
}
