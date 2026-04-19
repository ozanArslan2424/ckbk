import localeConfig from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import en from "./en";
import tr from "./tr";

export const locales = {
	en,
	tr,
};

export const LANG_OPTIONS = ["en", "tr"] satisfies (keyof typeof locales)[];

void localeConfig
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		fallbackLng: "en",
		interpolation: {
			escapeValue: false,
		},
		resources: locales,
		detection: {
			order: ["localStorage", "navigator", "htmlTag"],
			caches: ["localStorage"],
		},
	});

export default localeConfig;
