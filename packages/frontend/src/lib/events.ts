import React from "react";

export namespace Events {
	export type Handler<E> = (e: E) => void;
	export type Factory<EventT, ArgsT extends any[]> = (...args: ArgsT) => Handler<EventT>;
	function createFactory<EventT, ArgsT extends any[]>(
		cb: (e: EventT, ...args: ArgsT) => void,
	): Factory<EventT, ArgsT> {
		return (...args: ArgsT) =>
			(e: EventT) => {
				cb(e, ...args);
			};
	}

	export type ClickEvent<E = HTMLButtonElement> = React.MouseEvent<E>;
	export type ClickHandler<E = HTMLButtonElement> = Handler<ClickEvent<E>>;
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
	export type FocusHandler<E = HTMLInputElement> = Handler<FocusEvent<E>>;
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
	export type ChangeHandler<E = HTMLInputElement> = Handler<ChangeEvent<E>>;
	export type ChangeFactory<T extends any[] = any[], E = HTMLInputElement> = Factory<
		ChangeEvent<E>,
		T
	>;

	export function change<T extends any[] = any[], E = HTMLInputElement>(
		cb: (e: ChangeEvent<E>, ...args: T) => void,
	) {
		return createFactory<ChangeEvent<E>, T>(cb);
	}
}
