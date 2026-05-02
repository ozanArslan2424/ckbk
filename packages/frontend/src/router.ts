import { createBrowserRouter } from "react-router";

import { CreateProfilePage } from "@/pages/CreateProfilePage";

import { AppLayout } from "./components/layout/AppLayout";
import { AuthLayout } from "./components/layout/AuthLayout";
import { ErrorBoundary } from "./components/layout/ErrorBoundary";
import { ProtectedLayout } from "./components/layout/ProtectedLayout";
import { PublicLayout } from "./components/layout/PublicLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { VerifyPage } from "./pages/VerifyPage";

export const routes = {
	landing: "/",
	dashboard: "/dashboard",
	login: "/login",
	register: "/register",
	verify: "/verify",
	createProfile: "/create-profile",
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
					{ path: routes.createProfile, Component: CreateProfilePage },
				],
			},
			// Fallback route for 404 pages
			{ path: "*", Component: ErrorBoundary },
		],
	},
]);
