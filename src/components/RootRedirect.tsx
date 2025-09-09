import { Navigate } from "react-router-dom";
import { UserAuth } from "@/context/AuthContext";

const RootRedirect = () => {
	const { session, isLoadingSession } = UserAuth();
	const isReturningUser =
		localStorage.getItem("orbit_returning_user") === "true";

	if (isLoadingSession) return null; // Or a loading spinner

	// 1. If logged in, go to Dashboard
	if (session) {
		return <Navigate to='/dashboard' replace />;
	}

	// 2. If not logged in, but they've been here before, go to Login
	if (isReturningUser) {
		return <Navigate to='/login' replace />;
	}

	// 3. Brand new user, show Landing
	return <Navigate to='/landing' replace />;
};

export default RootRedirect;
