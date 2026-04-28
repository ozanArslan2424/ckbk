// import dayjs from "dayjs";
// import advancedFormat from "dayjs/plugin/advancedFormat";
// import isBetween from "dayjs/plugin/isBetween";
// import relativeTime from "dayjs/plugin/relativeTime";
// import timezone from "dayjs/plugin/timezone";
// import utc from "dayjs/plugin/utc";
// import "dayjs/locale/tr";
// import "dayjs/locale/en";
// import localeConfig from "i18next";
// import LanguageDetector from "i18next-browser-languagedetector";
// import { initReactI18next } from "react-i18next";
//
// import en from "./en";
// import tr from "./tr";
//
// export const locales = {
// 	en,
// 	tr,
// };
//
// export const LANG_OPTIONS = ["en", "tr"] satisfies (keyof typeof locales)[];
//
// let initialized = false;
//
// /**
//  * Initializes i18next and dayjs. Safe to call multiple times — only runs once.
//  * Returns the detected/initial language so the caller can seed the store.
//  */
// export function initLocale(): string {
// 	if (initialized) return localeConfig.language;
// 	initialized = true;
//
// 	dayjs.extend(advancedFormat);
// 	dayjs.extend(utc);
// 	dayjs.extend(timezone);
// 	dayjs.extend(isBetween);
// 	dayjs.extend(relativeTime);
//
// 	void localeConfig
// 		.use(LanguageDetector)
// 		.use(initReactI18next)
// 		.init({
// 			fallbackLng: "en",
// 			interpolation: {
// 				escapeValue: false,
// 			},
// 			resources: locales,
// 			detection: {
// 				order: ["localStorage", "navigator", "htmlTag"],
// 				caches: ["localStorage"],
// 			},
// 		});
//
// 	dayjs.locale(localeConfig.language);
// 	return localeConfig.language;
// }
//
// export default localeConfig;
