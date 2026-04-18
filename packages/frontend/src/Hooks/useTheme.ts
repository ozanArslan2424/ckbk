import { useTheme as useNextTheme } from "next-themes";

export function useTheme() {
	const { resolvedTheme, setTheme } = useNextTheme();

	const theme = resolvedTheme as "light" | "dark";
	const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

	return { theme, toggleTheme };
}
