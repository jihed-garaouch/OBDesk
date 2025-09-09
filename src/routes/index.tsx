import AuthCallback from "@/components/Auth/AuthCallBack";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import PublicGuard from "@/components/PublicGuard";
import RootRedirect from "@/components/RootRedirect";
import CurrencyScreen from "@/screens/Dashboard/Currency";
import FinanceScreen from "@/screens/Dashboard/Finance";
import HomeScreen from "@/screens/Dashboard/Home";
import SingleFinanceScreen from "@/screens/Dashboard/SingleFinance";
import TaskManagerScreen from "@/screens/Dashboard/TaskManager";
import WorldClockScreen from "@/screens/Dashboard/WorldClock";
import LandingScreen from "@/screens/Landing/Landing";
import LoginScreen from "@/screens/Login/Login";
import NotFound from "@/screens/NotFound/NotFound";
import SignUpScreen from "@/screens/SignUp/SignUp";
import React from "react";

export type AppRoute = {
	path: string;
	element: React.ReactElement;
	protected?: boolean;
	children?: AppRoute[];
};

const routes: AppRoute[] = [
	{ path: "/", element: <RootRedirect /> },

	{ path: "/auth/v1/callback", element: <AuthCallback /> },

	{
		path: "/dashboard",
		element: <DashboardLayout />,
		protected: true,
		children: [
			{ path: "", element: <HomeScreen /> },
			{ path: "world-clock", element: <WorldClockScreen /> },
			{ path: "currency", element: <CurrencyScreen /> },
			{
				path: "finance",
				element: <FinanceScreen />,
			},
			{ path: "finance/income", element: <SingleFinanceScreen /> },
			{ path: "finance/expense", element: <SingleFinanceScreen /> },
			{ path: "task-manager", element: <TaskManagerScreen /> },
		],
	},

	{
		path: "/landing",
		element: (
			<PublicGuard>
				<LandingScreen />
			</PublicGuard>
		),
	},
	{
		path: "/login",
		element: (
			<PublicGuard>
				<LoginScreen />
			</PublicGuard>
		),
	},
	{
		path: "/sign-up",
		element: (
			<PublicGuard>
				<SignUpScreen />
			</PublicGuard>
		),
	},

	{ path: "*", element: <NotFound /> },
];

export default routes;
