import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import "dayjs/locale/tr";
import "dayjs/locale/en";
import isBetween from "dayjs/plugin/isBetween";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import type { Help } from "@/lib/Help";
import type { locales } from "@/lib/Locale/localeConfig";

type DInput = dayjs.ConfigType;
type NS = keyof (typeof locales)["en"];

export function useLocale(ns?: NS) {
	const { t, i18n } = useTranslation(ns);
	dayjs.extend(advancedFormat);
	dayjs.extend(utc);
	dayjs.extend(timezone);
	dayjs.extend(isBetween);
	dayjs.extend(relativeTime);
	dayjs.locale(i18n.language);

	const timestamp = (date?: DInput) => ({
		now: dayjs(new Date()),
		iso: dayjs(date).toISOString(),
		fromNow: dayjs(date).fromNow(),
		shortDate: dayjs(date).format("DD.MM.YYYY"),
		short: dayjs(date).format("DD MMM YYYY"),
		long: dayjs(date).format("DD MMMM YYYY"),
		dateTimeNumber: dayjs(date).format("DD.MM.YYYY HH:mm"),
		dateTimeShort: dayjs(date).format("DD MMM YYYY HH:mm"),
		dateTimeLong: dayjs(date).format("DD MMMM YYYY HH:mm"),
		ordinalDateTime: dayjs(date).format("D MMMM, HH:mm"),
		ordinalDate: dayjs(date).format("D MMMM"),
		date: dayjs(date).format("YYYY-MM-DD"),
		numberInMonth: dayjs(date).format("D"),
		numberInWeek: dayjs(date).format("d"),
		shortName: dayjs(date).format("ddd"),
		name: dayjs(date).format("dddd"),
		time: dayjs(date).format("HH:mm"),
		hour: dayjs(date).format("H"),
		minute: dayjs(date).format("m"),
		second: dayjs(date).format("s"),
		custom: (format: string) => dayjs(date).format(format),
	});

	const compareTime = (date: DInput) => ({
		before: (compare: DInput) => dayjs(date).isBefore(compare),
		after: (compare: DInput) => dayjs(date).isAfter(compare),
		between: (start: DInput, end: DInput) => dayjs(date).isBetween(start, end),
		same: (compare: DInput) => dayjs(date).isSame(compare),
	});

	const makeTranslator = (ns: NS) => (key: string, opts?: Help.UnknownObject) =>
		t(key, { ns, ...opts });

	const toggleLanguage = useCallback(async () => {
		await i18n.changeLanguage(i18n.language === "en" ? "tr" : "en");
	}, []);

	return {
		t,
		makeTranslator,
		toggleLanguage,
		i18n,
		timestamp,
		compareTime,
	};
}
