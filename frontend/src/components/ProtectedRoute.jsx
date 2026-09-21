import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <p>Loading Nexora AI...</p>;
    }

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    return children;
}

export default ProtectedRoute;