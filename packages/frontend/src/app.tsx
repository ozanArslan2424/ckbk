import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/react";
import { RouterProvider } from "react-router";

import { ColorRegister } from "@/Components/layout/ColorRegister";
import { Toaster } from "@/Components/ui/sonner";
import { ActiveContextProvider } from "@/Context/ActiveContext";
import { AppContextProvider } from "@/Context/AppContext";

import "./lib/Locale/localeConfig.ts";
import "./styles/theme.ts";
import { router } from "@/router";

export function App() {
	return (
		<NuqsAdapter>
			<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
				<AppContextProvider>
					<ActiveContextProvider>
						<ColorRegister />
						<Toaster richColors position="top-right" />
						<RouterProvider router={router} />
					</ActiveContextProvider>
				</AppContextProvider>
			</ThemeProvider>
		</NuqsAdapter>
	);
}
