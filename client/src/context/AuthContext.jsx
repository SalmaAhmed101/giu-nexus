import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    setAuthLoading(false);
  }, []);

  function saveAuth(newToken, newUser) {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }

  async function login(email, password) {
  const { data } = await api.post("/auth/login", { email, password });

  const token = data.token;
  const user = data.user || data.data?.user;

  if (!token || !user) {
    throw new Error("Login response missing token or user");
  }

  saveAuth(token, user);
  return user;
}

  async function register(formData) {
  const { data } = await api.post("/auth/register", formData);

  const token = data.token;
  const user = data.user || data.data?.user;

  if (!token || !user) {
    throw new Error("Register response missing token or user");
  }

  saveAuth(token, user);
  return user;
}

  async function logout() {
    try {
      await api.post("/auth/logout");
    } catch {
      // Even if backend logout fails, clear frontend session.
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        authLoading,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;