import * as React from "react";

const MOBILE_BREAKPOINT = 640; // 40rem

export function useIsMobile() {
	const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

	React.useEffect(() => {
		const mediaQuery = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;
		const mql = window.matchMedia(mediaQuery);
		const onChange = (e: MediaQueryListEvent) => {
			setIsMobile(e.matches);
		};
		setIsMobile(mql.matches);
		mql.addEventListener("change", onChange);
		return () => mql.removeEventListener("change", onChange);
	}, []);

	return !!isMobile;
}
