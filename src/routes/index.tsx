import React from "react";
import { Navigate } from "react-router-dom";
import LoginScreen from "@/screens/Login/Login";
import SignUpScreen from "@/screens/SignUp/SignUp";
import NotFound from "@/screens/NotFound/NotFound";
import HomeScreen from "@/screens/Dashboard/Home";
import FinanceScreen from "@/screens/Dashboard/Finance";
import TodoScreen from "@/screens/Dashboard/Todo";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import AuthCallback from "@/components/Auth/AuthCallBack";

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
			{ path: "finance", element: <FinanceScreen /> },
			{ path: "todo", element: <TodoScreen /> },
		],
	},

	{ path: "/login", element: <LoginScreen /> },
	{ path: "/sign-up", element: <SignUpScreen /> },

	{ path: "*", element: <NotFound /> },
];

export default routes;
