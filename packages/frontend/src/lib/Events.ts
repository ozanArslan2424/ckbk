import React from "react";

export namespace Events {
	export type Factory<E, Args extends any[]> = (...args: Args) => (e: E) => void;

	export function createFactory<E, Args extends any[]>(
		cb: (e: E, ...args: Args) => void,
	): Factory<E, Args> {
		return (...args: Args) =>
			(e: E) => {
				cb(e, ...args);
			};
	}

	export type ClickEvent<E = HTMLButtonElement> = React.MouseEvent<E>;
	export type ClickFactory<T extends any[] = any[], E = HTMLButtonElement> = Factory<
		ClickEvent<E>,
		T
	>;

	export function click<T extends any[] = any[], E = HTMLButtonElement>(
		cb: (e: ClickEvent<E>, ...args: T) => void,
	) {
		return createFactory<ClickEvent<E>, T>(cb);
	}

	export type FocusEvent<E = HTMLInputElement> = React.FocusEvent<E>;
	export type FocusFactory<T extends any[] = any[], E = HTMLInputElement> = Factory<
		FocusEvent<E>,
		T
	>;

	export function focus<T extends any[] = any[], E = HTMLInputElement>(
		cb: (e: FocusEvent<E>, ...args: T) => void,
	) {
		return createFactory<FocusEvent<E>, T>(cb);
	}

	export type ChangeEvent<E = HTMLInputElement> = React.ChangeEvent<E>;
	export type ChangeFactory<T extends any[] = any[], E = HTMLInputElement> = Factory<
		ChangeEvent<E>,
		T
	>;

	export function change<T extends any[] = any[], E = HTMLInputElement>(
		cb: (e: ChangeEvent<E>, ...args: T) => void,
	) {
		return createFactory<ChangeEvent<E>, T>(cb);
	}

	export type BlurChangeEvent<E = HTMLInputElement> = React.ChangeEvent<E> | React.FocusEvent<E>;
	export type BlurChangeFactory<T extends any[] = any[], E = HTMLInputElement> = Factory<
		BlurChangeEvent<E>,
		T
	>;

	export function blurChange<T extends any[] = any[], E = HTMLInputElement>(
		cb: (e: BlurChangeEvent<E>, ...args: T) => void,
	) {
		return createFactory<BlurChangeEvent<E>, T>(cb);
	}

	export type DragEvent<E = HTMLElement> = React.DragEvent<E>;
	export type DragFactory<T extends any[] = any[], E = HTMLElement> = Factory<DragEvent<E>, T>;

	export function drag<T extends any[] = any[], E = HTMLInputElement>(
		cb: (e: DragEvent<E>, ...args: T) => void,
	) {
		return createFactory<DragEvent<E>, T>(cb);
	}
}
