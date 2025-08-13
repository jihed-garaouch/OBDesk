import AuthCallback from "@/components/Auth/AuthCallBack";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import CurrencyScreen from "@/screens/Dashboard/Currency";
import FinanceScreen from "@/screens/Dashboard/Finance";
import HomeScreen from "@/screens/Dashboard/Home";
import SingleFinanceScreen from "@/screens/Dashboard/SingleFinance";
import TaskManagerScreen from "@/screens/Dashboard/TaskManager";
import WorldClockScreen from "@/screens/Dashboard/WorldClock";
import LoginScreen from "@/screens/Login/Login";
import NotFound from "@/screens/NotFound/NotFound";
import SignUpScreen from "@/screens/SignUp/SignUp";
import React from "react";
import { Navigate } from "react-router-dom";

export type AppRoute = {
	path: string;
	element: React.ReactElement;
	protected?: boolean;
	children?: AppRoute[];
};

const routes: AppRoute[] = [
	{ path: "/", element: <Navigate to='/dashboard' replace /> },

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

	{ path: "/login", element: <LoginScreen /> },
	{ path: "/sign-up", element: <SignUpScreen /> },

	{ path: "*", element: <NotFound /> },
];

export default routes;
