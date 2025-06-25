import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserAuth } from "@/context/AuthContext";

interface LocationState {
	from?: {
		pathname: string;
	};
}

const AuthCallback = () => {
	const { session, isLoadingSession } = UserAuth();
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		if (isLoadingSession) return;

		const state = location.state as LocationState | null;
		const from = state?.from?.pathname ?? "/dashboard";

		if (session) {
			navigate(from, { replace: true });
		} else {
			navigate("/login", { replace: true });
		}
	}, [isLoadingSession, session, location, navigate]);

	return null;
};

export default AuthCallback;
