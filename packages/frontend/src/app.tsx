import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/react";
import { RouterProvider } from "react-router";

import { AppContextProvider } from "@/App/AppContext.tsx";
import { ColorRegister } from "@/Components/layout/ColorRegister";
import { Toaster } from "@/Components/ui/sonner";

import "./Locale/localeConfig.ts";
import "./styles/theme.ts";
import { router } from "@/router";

export function App() {
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
