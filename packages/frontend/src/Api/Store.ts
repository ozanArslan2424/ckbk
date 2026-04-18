export class Store {
	private _data = new Map<string, any>();

	constructor(initialData: StoreSchema) {
		for (const [key, value] of Object.entries(initialData)) {
			this._data.set(key, value);
		}
	}

	set<K extends keyof StoreSchema>(key: K, value: StoreSchema[K]): void;
	set<T>(key: string, value: T): void;
	set(key: string, value: any): void {
		this._data.set(key, value);
	}

	get<K extends keyof StoreSchema>(key: K): StoreSchema[K] | undefined;
	get<T>(key: string): T | undefined;
	get(key: string): any {
		return this._data.get(key);
	}

	getOrDefault<K extends keyof StoreSchema>(key: K, defaultValue: StoreSchema[K]): StoreSchema[K];
	getOrDefault<T>(key: string, defaultValue: T): T;
	getOrDefault(key: string, defaultValue: any): any {
		const value = this._data.get(key);
		return value !== undefined ? value : defaultValue;
	}

	has(key: string): boolean {
		return this._data.has(key);
	}

	delete(key: string): boolean {
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
