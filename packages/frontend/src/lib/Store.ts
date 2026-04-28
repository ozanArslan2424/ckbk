type Listener<K extends keyof StoreSchema> = (value: StoreSchema[K] | null) => void;

export class Store {
	private readonly _data = new Map<string, any>();
	private readonly _listeners = new Map<string, Set<Listener<any>>>();

	constructor(initialData: StoreSchema) {
		for (const [key, value] of Object.entries(initialData)) {
			this._data.set(key, value);
		}
	}

	get<K extends keyof StoreSchema>(key: K): StoreSchema[K] | null {
		return this._data.get(key) ?? null;
	}

	set<K extends keyof StoreSchema>(key: K, value: StoreSchema[K]): void {
		const prev = this._data.get(key);
		if (Object.is(prev, value)) return;
		this._data.set(key, value);
		this._listeners.get(key)?.forEach((l) => l(value));
	}

	subscribe<K extends keyof StoreSchema>(key: K, listener: Listener<K>): () => void {
		let set = this._listeners.get(key);
		if (!set) {
			set = new Set();
			this._listeners.set(key, set);
		}
		set.add(listener);
		return () => {
			set.delete(listener);
			if (set.size === 0) this._listeners.delete(key);
		};
	}

	delete<K extends keyof StoreSchema>(key: K): boolean {
		const had = this._data.delete(key);
		if (had) this._listeners.get(key)?.forEach((l) => l(null));
		return had;
	}

	clear(): void {
		const keys = Array.from(this._data.keys());
		this._data.clear();
		for (const k of keys) {
			this._listeners.get(k)?.forEach((l) => l(null));
		}
	}

	has<K extends keyof StoreSchema>(key: K): boolean {
		return this._data.has(key);
	}

	keys(): IterableIterator<string> {
		return this._data.keys();
	}

	size(): number {
		return this._data.size;
	}
}
