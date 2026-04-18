import { createBrowserRouter } from "react-router";

import { AppLayout } from "./Pages/AppLayout";
import { AuthLayout } from "./Pages/AuthLayout";
import { DashboardPage } from "./Pages/DashboardPage";
import { ErrorBoundary } from "./Pages/ErrorBoundary";
import { LandingPage } from "./Pages/LandingPage";
import { LoginPage } from "./Pages/LoginPage";
import { ProtectedLayout } from "./Pages/ProtectedLayout";
import { PublicLayout } from "./Pages/PublicLayout";
import { RegisterPage } from "./Pages/RegisterPage";
import { VerifyPage } from "./Pages/VerifyPage";

export const routes = {
	landing: "/",
	dashboard: "/dashboard",
	login: "/login",
	register: "/register",
	verify: "/verify",
};

export const router = createBrowserRouter([
	{
		Component: AppLayout,
		ErrorBoundary,
		children: [
			{
				Component: PublicLayout,
				children: [{ path: routes.landing, Component: LandingPage }],
			},
			{
				Component: ProtectedLayout,
				children: [{ path: routes.dashboard, Component: DashboardPage }],
			},
			{
				Component: AuthLayout,
				children: [
					{ path: routes.login, Component: LoginPage },
					{ path: routes.register, Component: RegisterPage },
					{ path: routes.verify, Component: VerifyPage },
				],
			},
			// Fallback route for 404 pages
			{ path: "*", Component: ErrorBoundary },
		],
	},
]);
