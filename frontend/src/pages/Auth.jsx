import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const { signup, login, loginWithGoogle, resetPassword } = useAuth();

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      if (mode === "signup") {
        await signup(email, password);
        navigate("/onboarding", { replace: true });
      } else {
        await login(email, password);
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setMessage("");
    setError("");
    setLoading(true);

    try {
      await loginWithGoogle();
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword() {
    if (!email) {
      setError("Enter your email address first.");
      return;
    }

    setMessage("");
    setError("");
    setLoading(true);

    try {
      await resetPassword(email);
      setMessage("Password reset email sent.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Nexora AI</h1>
      <p>AI-Powered Business Automation</p>

      <h2>{mode === "login" ? "Sign in" : "Create account"}</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <br />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <br />

        <div>
          <label htmlFor="password">Password</label>
          <br />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
            minLength={6}
          />
        </div>

        <br />

        <button type="submit" disabled={loading}>
          {loading
            ? "Please wait..."
            : mode === "login"
              ? "Sign in"
              : "Create account"}
        </button>
      </form>

      <br />

      <button type="button" onClick={handleGoogleLogin} disabled={loading}>
        Continue with Google
      </button>

      {mode === "login" && (
        <>
          <br />
          <br />
          <button type="button" onClick={handleResetPassword} disabled={loading}>
            Forgot password?
          </button>
        </>
      )}

      <br />
      <br />

      <button
        type="button"
        onClick={() => {
          setMode(mode === "login" ? "signup" : "login");
          setMessage("");
          setError("");
        }}
      >
        {mode === "login"
          ? "Create a new account"
          : "Already have an account? Sign in"}
      </button>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  );
}