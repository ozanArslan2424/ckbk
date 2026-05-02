export function addToCollection<
	B extends Record<string, Record<string, string>>,
	P extends string,
	E extends Record<string, Record<string, string>>,
>(base: B, prefix: P, entries: E): B & { [K in keyof E as `${P}.${K & string}`]: E[K] } {
	const result = { ...base } as Record<string, Record<string, string>>;
	for (const [key, value] of Object.entries(entries)) {
		result[`${prefix}.${key}`] = value;
	}
	return result as B & { [K in keyof E as `${P}.${K & string}`]: E[K] };
}
