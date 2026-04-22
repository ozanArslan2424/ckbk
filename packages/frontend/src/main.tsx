import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";

import { AppContextProvider } from "@/app/AppContext.tsx";
import { ColorRegister } from "@/components/layout/ColorRegister.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";

import "./locale/localeConfig.ts";
import "./styles/theme.ts";
import { router } from "@/router";

function App() {
	return (
		<NuqsAdapter>
			<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
				<AppContextProvider>
					<ColorRegister />
					<Toaster richColors position="top-right" />
					<RouterProvider router={router} />
				</AppContextProvider>
			</ThemeProvider>
		</NuqsAdapter>
	);
}

function main() {
	const el = document.getElementById("root");
	if (!el) throw new Error("DOM element not found.");
	const root = ReactDOM.createRoot(el);
	root.render(<App />);
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", main);
} else {
	main();
}
