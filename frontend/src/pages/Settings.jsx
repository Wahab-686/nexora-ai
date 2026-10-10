import { useState } from "react";

import PageContainer from "../components/PageContainer";
import { useAuth } from "../context/AuthContext";

function Settings() {
  const { user, getIdToken } = useAuth();

  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGetToken() {
    try {
      setLoading(true);
      setMessage("");
      setToken("");

      const freshToken = await getIdToken();

      setToken(freshToken);
      setMessage(
        "Token generated. Copy it into Swagger's Authorize dialog."
      );
    } catch (error) {
      console.error("Firebase token retrieval failed.");
      setMessage(
        error.message || "Unable to retrieve the Firebase ID token."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCopyToken() {
    if (!token) return;

    try {
      await navigator.clipboard.writeText(token);
      setMessage("Token copied. Paste it into Swagger's Authorize dialog.");
    } catch {
      setMessage(
        "Automatic copying failed. Select the token below and copy it manually."
      );
    }
  }

  return (
    <PageContainer
      title="Settings"
      description="Manage your Nexora AI workspace and account preferences."
    >
      <p>Settings workspace coming next.</p>

      {import.meta.env.DEV && user && (
        <section>
          <h2>Developer Tools</h2>
          <p>
            Generate a Firebase ID token for testing authenticated
            API endpoints in Swagger.
          </p>

          <button
            type="button"
            onClick={handleGetToken}
            disabled={loading}
          >
            {loading ? "Generating token..." : "Get Firebase Token"}
          </button>

          {token && (
            <div>
              <label htmlFor="firebase-token">
                Firebase ID token
              </label>

              <textarea
                id="firebase-token"
                value={token}
                readOnly
                rows={5}
                spellCheck={false}
                autoComplete="off"
                style={{
                  display: "block",
                  width: "100%",
                  marginTop: "8px",
                  overflowWrap: "anywhere",
                  boxSizing: "border-box",
                }}
              />

              <button
                type="button"
                onClick={handleCopyToken}
              >
                Copy Token
              </button>

              <button
                type="button"
                onClick={() => {
                  setToken("");
                  setMessage("");
                }}
              >
                Clear Token
              </button>
            </div>
          )}

          {message && <p role="status">{message}</p>}

          <p>
            Security: treat this token like a password. Do not
            share it or commit it to GitHub. This developer tool
            is hidden in production builds.
          </p>
        </section>
      )}
    </PageContainer>
  );
}

export default Settings;