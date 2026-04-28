import "dayjs/locale/tr";
import "dayjs/locale/en";
import type { TFunction } from "i18next";
import { useMemo, useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";

import { useAppContext } from "@/app/AppContext";
import type { NS } from "@/locale/Locale";

type LocaleText = Record<string, Parameters<TFunction>>;

export function useLocale<T extends LocaleText>(ns?: NS, localeText?: T) {
	const { store } = useAppContext();
	const { t, i18n } = useTranslation(ns);

	const txt = useMemo(() => {
		const target = {} as { [K in keyof T]: string };
		if (!localeText) return target;
		// Only calls 't' when the property is accessed
		return new Proxy(target, {
			get(_, prop: string) {
				const params = localeText[prop];
				// oxlint-disable-next-line typescript/no-unnecessary-condition
				return params ? t(...params) : undefined;
			},
			has(_, prop) {
				return prop in localeText;
			},
			ownKeys() {
				return Reflect.ownKeys(localeText);
			},
			getOwnPropertyDescriptor() {
				return { enumerable: true, configurable: true };
			},
		});
	}, [t, localeText]);

	const language = useSyncExternalStore(
		(cb) => store.subscribe("locale", cb),
		() => store.get("locale"),
	);

	function changeLanguage(lang: string) {
		store.set("locale", lang);
	}

	return {
		t,
		i18n,
		txt,
		language,
		changeLanguage,
	};
}
