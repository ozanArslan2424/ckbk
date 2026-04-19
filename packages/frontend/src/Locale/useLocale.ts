import "dayjs/locale/tr";
import "dayjs/locale/en";
import type { TFunction } from "i18next";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { locales } from "@/Locale/localeConfig";

type NS = keyof (typeof locales)["en"];
type LocaleText = Record<string, Parameters<TFunction>>;

export function useLocale<T extends LocaleText>(ns?: NS, localeText?: T) {
	const { t, i18n } = useTranslation(ns);

	const txt = useMemo(() => {
		const target = {} as { [K in keyof T]: string };

		if (!localeText) return target;

		// Only calls 't' when the property is accessed
		return new Proxy(target, {
			get(_, prop: string) {
				const params = localeText[prop];
				if (params) {
					return t(...params);
				}
				return undefined;
			},
			ownKeys() {
				return Reflect.ownKeys(localeText);
			},
			getOwnPropertyDescriptor() {
				return {
					enumerable: true,
					configurable: true,
				};
			},
		});
	}, [t, i18n.language, localeText]);

	return {
		t,
		i18n,
		txt,
	};
}
