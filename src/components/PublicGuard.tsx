import { UserAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const PublicGuard = ({ children }: { children: React.ReactNode }) => {
    const { session, isLoadingSession } = UserAuth();

    if (isLoadingSession) return null;

    if (session) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};

export default PublicGuard;