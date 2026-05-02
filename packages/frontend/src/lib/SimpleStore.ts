export interface SimpleStore<T> {
	get(): T | null;
	set(value: T | null): void;
	clear(): void;
}

export class MemoryStore<T> implements SimpleStore<T> {
	constructor(initialValue?: T) {
		if (initialValue) this.value = initialValue;
	}
	private value: T | null = null;
	get() {
		return this.value;
	}
	set(value: T | null) {
		this.value = value;
	}
	clear() {
		this.value = null;
	}
}

export class WebStore implements SimpleStore<string> {
	constructor(
		private readonly storage: Storage,
		private readonly key: string,
	) {}
	get() {
		return this.storage.getItem(this.key);
	}
	set(value: string | null) {
		if (value == null) this.storage.removeItem(this.key);
		else this.storage.setItem(this.key, value);
	}
	clear() {
		this.storage.removeItem(this.key);
	}
}
