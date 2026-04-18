import { createContext, use, type PropsWithChildren } from "react";

function useActiveHook() {
	return {};
}

const ActiveContext = createContext<ReturnType<typeof useActiveHook> | null>(null);

export function useActiveContext() {
	const context = use(ActiveContext);
	if (!context) throw new Error("useActiveContext missing provider");
	return context;
}

export function ActiveContextProvider({ children }: PropsWithChildren) {
	const value = useActiveHook();
	return <ActiveContext value={value}>{children}</ActiveContext>;
}
