import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import {
  getToken,
  getStoredUser,
  saveAuthData,
  clearAuthData,
} from "../utils/tokenManager";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const storedToken = getToken();
    const storedUser = getStoredUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }

    setAuthLoading(false);
  }, []);

  function saveAuth(newToken, newUser) {
    saveAuthData(newToken, newUser);
    setToken(newToken);
    setUser(newUser);
  }

  async function login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });

    const newToken = data.token;
    const newUser = data.user || data.data?.user;

    if (!newToken || !newUser) {
      throw new Error("Login response missing token or user");
    }

    saveAuth(newToken, newUser);
    return newUser;
  }

  async function register(formData) {
    const { data } = await api.post("/auth/register", formData);

    const newToken = data.token;
    const newUser = data.user || data.data?.user;

    if (!newToken || !newUser) {
      throw new Error("Register response missing token or user");
    }

    saveAuth(newToken, newUser);
    return newUser;
  }

  async function logout() {
    try {
      await api.post("/auth/logout");
    } catch {
      // Even if backend logout fails, clear frontend session.
    }

    clearAuthData();
    setToken(null);
    setUser(null);
  }

  const isAuthenticated = Boolean(token);

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