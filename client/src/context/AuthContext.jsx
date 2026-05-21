// ⚠️  STUB — REPLACE WITH M1's AuthContext.jsx
// This file is intentionally written to match exactly what M1's spec requires.
// Safe to DELETE and OVERWRITE this entire file when M1 submits their work.
// Nothing in Member 2's files depends on the internals — they only import { useAuth }.

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

// Custom hook — all of Member 2's pages use this, never AuthContext directly.
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Restore session from localStorage on first load (matches M1 spec)
  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    if (t && u) {
      try {
        setToken(t);
        setUser(JSON.parse(u));
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const isAuthenticated = !!token;

  // Stores credentials and updates state (matches M1 spec)
  function login(newToken, newUser) {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }

  // Clears storage and resets state (matches M1 spec)
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
