import { useAuth } from "../context/AuthContext";

function Header() {
  const { user, logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <header className="app-header">
      <div>
        <h2>Nexora AI</h2>
        <p>AI-Powered Business Automation</p>
      </div>

      <div>
        {user && (
          <>
            <span>{user.email}</span>
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;