export class Store {
	private _data = new Map<string, any>();

	constructor(initialData: StoreSchema) {
		for (const [key, value] of Object.entries(initialData)) {
			this._data.set(key, value);
		}
	}

	set<K extends keyof StoreSchema>(key: K, value: StoreSchema[K]): void {
		this._data.set(key, value);
	}

	get<K extends keyof StoreSchema>(key: K): StoreSchema[K] | null {
		return this._data.get(key) ?? null;
	}

	getOrDefault<K extends keyof StoreSchema>(key: K, defaultValue: StoreSchema[K]): StoreSchema[K] {
		const value = this._data.get(key);
		return value !== undefined ? value : defaultValue;
	}

	has<K extends keyof StoreSchema>(key: K): boolean {
		return this._data.has(key);
	}

	delete<K extends keyof StoreSchema>(key: K): boolean {
		return this._data.delete(key);
	}

	clear(): void {
		this._data.clear();
	}

	keys(): IterableIterator<string> {
		return this._data.keys();
	}

	size(): number {
		return this._data.size;
	}
}
