import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>GIU Nexus</Link>

      <div style={styles.links}>
        <Link to="/jobs">Jobs</Link>

        {isAuthenticated && user?.role === "jobSeeker" && (
          <>
            <Link to="/jobs/saved">Saved Jobs</Link>
            <Link to="/applications/my">My Applications</Link>
          </>
        )}

        {!isAuthenticated ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <button onClick={handleLogout} style={styles.button}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    padding: "16px 32px",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontWeight: 700,
    fontSize: 20,
    textDecoration: "none",
  },
  links: {
    display: "flex",
    gap: 16,
    alignItems: "center",
  },
  button: {
    padding: "8px 12px",
    border: "none",
    borderRadius: 8,
    background: "#ef4444",
    color: "white",
    cursor: "pointer",
  },
};

export default Navbar;