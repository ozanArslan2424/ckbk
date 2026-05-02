import dayjs from "dayjs";

type DInput = dayjs.ConfigType;

export function useDate() {
	const timestamp = (date?: DInput) => ({
		now: dayjs(new Date()),
		iso: dayjs(date).toISOString(),
		fromNow: dayjs(date).fromNow(),
		numericalDate: dayjs(date).format("DD.MM.YYYY"),
		numericalDateTime: dayjs(date).format("DD.MM.YYYY HH:mm"),
		ordinalDate: dayjs(date).format("D MMMM"),
		ordinalDateTime: dayjs(date).format("D MMMM, HH:mm"),
		shortDate: dayjs(date).format("DD MMM YYYY"),
		shortDateTime: dayjs(date).format("DD MMM YYYY HH:mm"),
		longDate: dayjs(date).format("DD MMMM YYYY"),
		longDateTime: dayjs(date).format("DD MMMM YYYY HH:mm"),
		numberInMonth: dayjs(date).format("D"),
		numberInWeek: dayjs(date).format("d"),
		shortDay: dayjs(date).format("ddd"),
		longDay: dayjs(date).format("dddd"),
		date: dayjs(date).format("YYYY-MM-DD"),
		time: dayjs(date).format("HH:mm"),
		hour: dayjs(date).format("H"),
		minute: dayjs(date).format("m"),
		second: dayjs(date).format("s"),
		custom: (format: string) => dayjs(date).format(format),
	});

	const compare = (date: DInput) => ({
		before: (compare: DInput) => dayjs(date).isBefore(compare),
		after: (compare: DInput) => dayjs(date).isAfter(compare),
		between: (start: DInput, end: DInput) => dayjs(date).isBetween(start, end),
		same: (compare: DInput) => dayjs(date).isSame(compare),
	});

	return {
		timestamp,
		compare,
	};
}
