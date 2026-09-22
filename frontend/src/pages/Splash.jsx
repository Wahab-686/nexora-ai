import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Splash() {
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (loading) {
            return;
        }

        const timer = setTimeout(() => {
            if (user) {
                navigate("/dashboard", { replace: true });
            } else {
                navigate("/auth", { replace: true });
            }
        }, 2500);

        return () => clearTimeout(timer);
    }, [user, loading, navigate])

    return (
        <div className = "splash-screen">
            <div className = "splash-content">
                <h1>Nexora AI</h1>
                <p>AI-Powered Business Automation</p>
                <div className="splash-loader" />
            </div>
        </div>
    );
}

export default Splash;