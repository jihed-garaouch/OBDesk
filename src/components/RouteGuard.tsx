import { UserAuth } from "@/context/AuthContext";
import type { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";

const RouteGuard = ({ children }: { children: JSX.Element }) => {
	const { session, isLoadingSession } = UserAuth();
	const location = useLocation();

	if (isLoadingSession) {
		return null;
	}

	if (!session) {
		return <Navigate to='/login' state={{ from: location }} replace />;
	}

	return children;
};

export default RouteGuard;
